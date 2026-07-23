import { router, useForm } from '@inertiajs/react';
import { Plus, Scale, Search, Trash2, UserCheck } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import TransactionController from '@/actions/App/Http/Controllers/Admin/TransactionController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User, Sampah } from '@/types';

interface DepositPosDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nasabahs: User[];
    sampahItems: Sampah[];
}

export interface SampahInputItem {
    name: string;
    weight: string;
}

export function DepositPosDialog({
    open,
    onOpenChange,
    nasabahs,
    sampahItems,
}: DepositPosDialogProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            user_id: '' as string | number,
            total_weight: '',
            custom_price_per_kg: '',
        });

    // Start with 5 empty input fields by default
    const [sampahItemsInput, setSampahItemsInput] = useState<SampahInputItem[]>([
        { name: '', weight: '' },
        { name: '', weight: '' },
        { name: '', weight: '' },
        { name: '', weight: '' },
        { name: '', weight: '' },
    ]);
    const [nasabahSearch, setNasabahSearch] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [customError, setCustomError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initial setup when modal opens
    useEffect(() => {
        if (open) {
            clearErrors();
            reset();
            setCustomError(null);
            setNasabahSearch('');
            setIsDropdownOpen(false);
            setSampahItemsInput([
                { name: '', weight: '' },
                { name: '', weight: '' },
                { name: '', weight: '' },
                { name: '', weight: '' },
                { name: '', weight: '' },
            ]);

            if (nasabahs.length > 0) {
                setData('user_id', nasabahs[0].id);
            }
        }
    }, [open, nasabahs, clearErrors, reset, setData]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredNasabahs = nasabahs.filter((n) => {
        const q = nasabahSearch.toLowerCase();
        const nameMatch = n.name.toLowerCase().includes(q);
        const phoneMatch = (n.phone_number ?? '').toLowerCase().includes(q);
        return nameMatch || phoneMatch;
    });

    const selectedNasabah = nasabahs.find((n) => n.id === Number(data.user_id));

    // Dynamic Waste Name & Optional Weight Handlers
    const handleAddSampahColumn = () => {
        if (sampahItemsInput.length < 10) {
            setSampahItemsInput((prev) => [...prev, { name: '', weight: '' }]);
        }
    };

    const handleRemoveSampahColumn = (index: number) => {
        if (sampahItemsInput.length > 1) {
            const updated = sampahItemsInput.filter((_, i) => i !== index);
            setSampahItemsInput(updated);
            recalculateTotalWeight(updated);
        }
    };

    const handleItemChange = (
        index: number,
        field: 'name' | 'weight',
        value: string
    ) => {
        const updated = [...sampahItemsInput];
        updated[index] = { ...updated[index], [field]: value };
        setSampahItemsInput(updated);

        if (field === 'weight') {
            recalculateTotalWeight(updated);
        }
    };

    // Auto-calculate total weight if per-item weight is filled
    const recalculateTotalWeight = (items: SampahInputItem[]) => {
        const sum = items.reduce((acc, curr) => {
            const w = parseFloat(curr.weight);
            return acc + (isNaN(w) ? 0 : w);
        }, 0);

        if (sum > 0) {
            // Format to max 2 decimal places cleanly
            const formattedSum = Math.round(sum * 100) / 100;
            setData('total_weight', String(formattedSum));
        }
    };

    // Live calculation
    const weightVal = parseFloat(data.total_weight) || 0;
    const priceVal = parseFloat(data.custom_price_per_kg) || 0;
    const liveIncome = Math.round(weightVal * priceVal);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCustomError(null);

        const validItems = sampahItemsInput.filter((item) => item.name.trim() !== '');
        if (validItems.length === 0) {
            setCustomError('Minimal 1 kolom Jenis Sampah harus diisi.');
            return;
        }

        // Build names array & formatted string
        const formattedNamesList = validItems.map((item) => {
            const trimmedName = item.name.trim();
            const w = parseFloat(item.weight);
            if (!isNaN(w) && w > 0) {
                return `${trimmedName} (${w} kg)`;
            }
            return trimmedName;
        });

        const csrfToken =
            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

        router.post(
            TransactionController.store().url,
            {
                user_id: data.user_id,
                sampah_names: formattedNamesList,
                sampah_name: formattedNamesList.join(', '),
                total_weight: data.total_weight,
                custom_price_per_kg: data.custom_price_per_kg,
            },
            {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
                onError: (errs) => {
                    if (errs.sampah_names) {
                        setCustomError(errs.sampah_names);
                    }
                },
            }
        );
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <Scale className="size-5 text-emerald-600 dark:text-emerald-400" /> POS Setor Sampah
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Pencatatan setoran sampah warga. Berat dapat diisi per barang (opsional) atau langsung di totalan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Searchable Nasabah Picker */}
                    <div className="relative grid gap-2" ref={dropdownRef}>
                        <Label htmlFor="nasabah_search" className="font-semibold text-foreground text-xs">
                            Nasabah (Warga)
                        </Label>
                        <div className="relative">
                            <Input
                                id="nasabah_search"
                                type="text"
                                placeholder="Cari nama atau no. HP warga..."
                                value={nasabahSearch}
                                onChange={(e) => {
                                    setNasabahSearch(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                className="pr-9 text-xs"
                            />
                            <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                        </div>

                        {selectedNasabah && (
                            <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs">
                                <div className="flex items-center gap-1.5 font-medium text-emerald-900 dark:text-emerald-200">
                                    <UserCheck className="size-4 shrink-0 text-emerald-600" />
                                    <span className="font-bold">{selectedNasabah.name}</span>
                                </div>
                                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                                    📱 {selectedNasabah.phone_number || 'Tidak ada No HP'}
                                </span>
                            </div>
                        )}

                        {/* Dropdown Options */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-sidebar-border bg-popover text-popover-foreground shadow-lg">
                                {filteredNasabahs.length > 0 ? (
                                    filteredNasabahs.map((n) => (
                                        <button
                                            key={n.id}
                                            type="button"
                                            onClick={() => {
                                                setData('user_id', n.id);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-accent hover:text-accent-foreground ${
                                                n.id === Number(data.user_id)
                                                    ? 'bg-emerald-500/10 font-bold text-emerald-600'
                                                    : ''
                                            }`}
                                        >
                                            <span className="font-medium text-foreground">{n.name}</span>
                                            <span className="text-muted-foreground">
                                                📱 {n.phone_number || 'No HP -'}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-xs text-muted-foreground">
                                        Warga tidak ditemukan.
                                    </div>
                                )}
                            </div>
                        )}
                        <InputError message={errors.user_id} />
                    </div>

                    {/* DYNAMIC JENIS SAMPAH & OPTIONAL WEIGHT INPUTS */}
                    <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between border-b border-sidebar-border/70 pb-2">
                            <Label className="font-semibold text-foreground text-xs">
                                Jenis Sampah & Berat (Per Barang)
                            </Label>
                            {sampahItemsInput.length < 10 && (
                                <button
                                    type="button"
                                    onClick={handleAddSampahColumn}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
                                >
                                    <Plus className="size-3.5" /> Tambah Barang
                                </button>
                            )}
                        </div>

                        {customError && <InputError message={customError} />}

                        {/* Input Rows Header */}
                        <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-muted-foreground px-1">
                            <div className="col-span-7">Nama Barang / Jenis Sampah</div>
                            <div className="col-span-4">Berat (Kg) - Opsional</div>
                            <div className="col-span-1 text-center">Hapus</div>
                        </div>

                        <div className="space-y-2">
                            {sampahItemsInput.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-7">
                                        <Input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) =>
                                                handleItemChange(idx, 'name', e.target.value)
                                            }
                                            placeholder={`Contoh: ${
                                                idx === 0
                                                    ? 'Kardus'
                                                    : idx === 1
                                                    ? 'Botol Plastik'
                                                    : idx === 2
                                                    ? 'Besi'
                                                    : idx === 3
                                                    ? 'Kertas'
                                                    : 'Kaleng'
                                            }`}
                                            className="text-xs"
                                        />
                                    </div>

                                    <div className="col-span-4">
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min={0}
                                            value={item.weight}
                                            onChange={(e) =>
                                                handleItemChange(idx, 'weight', e.target.value)
                                            }
                                            placeholder="kg (opsional)"
                                            className="text-xs"
                                        />
                                    </div>

                                    <div className="col-span-1 flex justify-center">
                                        {sampahItemsInput.length > 1 ? (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSampahColumn(idx)}
                                                className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                                                title="Hapus barang ini"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        ) : (
                                            <span className="text-muted-foreground/30 text-xs">-</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            💡 *Isi berat per barang untuk otomatis menghitung total, atau langsung isi <strong>Berat Total (Kg)</strong> di bawah jika memilih totalan.
                        </p>
                    </div>

                    {/* TOTAL BERAT SAMPAH */}
                    <div className="grid gap-2 pt-1 border-t border-sidebar-border/50">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="total_weight" className="font-semibold text-foreground text-xs">
                                Berat Sampah Total (Kg)
                            </Label>
                            <span className="text-[11px] text-emerald-600 font-medium">
                                Totalan Utama
                            </span>
                        </div>
                        <Input
                            id="total_weight"
                            type="number"
                            step="0.1"
                            value={data.total_weight}
                            onChange={(e) => setData('total_weight', e.target.value)}
                            placeholder="Misal: 5.5 (Otomatis atau isi manual)"
                            min={0.1}
                            required
                            className="text-xs font-semibold"
                        />
                        <InputError message={errors.total_weight} />
                    </div>

                    {/* HARGA SATUAN PENGEPUL */}
                    <div className="grid gap-2">
                        <Label htmlFor="custom_price_per_kg" className="font-semibold text-foreground text-xs">
                            Harga Satuan Pengepul (Rp / Kg)
                        </Label>
                        <Input
                            id="custom_price_per_kg"
                            type="number"
                            step="100"
                            value={data.custom_price_per_kg}
                            onChange={(e) => setData('custom_price_per_kg', e.target.value)}
                            placeholder="Masukkan harga per kg (misal: 3000)..."
                            min={0}
                            required
                            className="text-xs"
                        />
                        <InputError message={errors.custom_price_per_kg} />
                    </div>

                    {/* Live Calculator Panel */}
                    <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                            <span>Total Uang Diterima Warga:</span>
                            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(liveIncome)}
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Setoran'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
