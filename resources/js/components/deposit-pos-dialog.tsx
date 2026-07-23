import { router, useForm } from '@inertiajs/react';
import { Layers, PackageCheck, Plus, Scale, Search, Trash2, UserCheck } from 'lucide-react';
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

export interface SampahPilahItem {
    name: string;
    weight: string;
    price_per_kg: string;
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

    // Mode Selector: 'campur' (Mode A) vs 'pilah' (Mode B)
    const [setoranMode, setSetoranMode] = useState<'campur' | 'pilah'>('campur');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State Mode A (Sampah Campur)
    const [sampahItemsInput, setSampahItemsInput] = useState<SampahInputItem[]>([
        { name: '', weight: '' },
        { name: '', weight: '' },
        { name: '', weight: '' },
        { name: '', weight: '' },
        { name: '', weight: '' },
    ]);

    // State Mode B (Sampah Pilah)
    const [sampahPilahInput, setSampahPilahInput] = useState<SampahPilahItem[]>([
        { name: '', weight: '', price_per_kg: '' },
        { name: '', weight: '', price_per_kg: '' },
        { name: '', weight: '', price_per_kg: '' },
        { name: '', weight: '', price_per_kg: '' },
        { name: '', weight: '', price_per_kg: '' },
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
            setIsSubmitting(false);
            setNasabahSearch('');
            setIsDropdownOpen(false);
            setSetoranMode('campur');
            setSampahItemsInput([
                { name: '', weight: '' },
                { name: '', weight: '' },
                { name: '', weight: '' },
                { name: '', weight: '' },
                { name: '', weight: '' },
            ]);
            setSampahPilahInput([
                { name: '', weight: '', price_per_kg: '' },
                { name: '', weight: '', price_per_kg: '' },
                { name: '', weight: '', price_per_kg: '' },
                { name: '', weight: '', price_per_kg: '' },
                { name: '', weight: '', price_per_kg: '' },
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

    // --- HANDLERS MODE A (SAMPAH CAMPUR) ---
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

    const recalculateTotalWeight = (items: SampahInputItem[]) => {
        const sum = items.reduce((acc, curr) => {
            const w = parseFloat(curr.weight);
            return acc + (isNaN(w) ? 0 : w);
        }, 0);

        if (sum > 0) {
            const formattedSum = Math.round(sum * 100) / 100;
            setData('total_weight', String(formattedSum));
        }
    };

    // Live calculation for Mode A
    const weightVal = parseFloat(data.total_weight) || 0;
    const priceVal = parseFloat(data.custom_price_per_kg) || 0;
    const liveIncomeModeA = Math.round(weightVal * priceVal);

    // --- HANDLERS MODE B (SAMPAH PILAH) ---
    const handleAddPilahRow = () => {
        if (sampahPilahInput.length < 10) {
            setSampahPilahInput((prev) => [...prev, { name: '', weight: '', price_per_kg: '' }]);
        }
    };

    const handleRemovePilahRow = (index: number) => {
        if (sampahPilahInput.length > 1) {
            setSampahPilahInput((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handlePilahChange = (
        index: number,
        field: 'name' | 'weight' | 'price_per_kg',
        value: string
    ) => {
        const updated = [...sampahPilahInput];

        if (field === 'name') {
            const masterSampah = sampahItems.find((s) => s.name === value);
            if (masterSampah) {
                updated[index] = {
                    ...updated[index],
                    name: masterSampah.name,
                    price_per_kg: String(masterSampah.price_per_kg),
                };
            } else {
                updated[index] = { ...updated[index], name: value };
            }
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }

        setSampahPilahInput(updated);
    };

    // Live calculation for Mode B
    const livePilahTotalWeight = Math.round(
        sampahPilahInput.reduce((acc, curr) => {
            const w = parseFloat(curr.weight);
            return acc + (isNaN(w) ? 0 : w);
        }, 0) * 100
    ) / 100;

    const livePilahTotalIncome = sampahPilahInput.reduce((acc, curr) => {
        const w = parseFloat(curr.weight);
        const p = parseFloat(curr.price_per_kg);
        return acc + (isNaN(w) || isNaN(p) ? 0 : Math.round(w * p));
    }, 0);

    // --- SUBMIT HANDLER ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setCustomError(null);
        const csrfToken =
            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

        if (setoranMode === 'campur') {
            // SUBMIT MODE A (SAMPAH CAMPUR)
            const validItems = sampahItemsInput.filter((item) => item.name.trim() !== '');
            if (validItems.length === 0) {
                setCustomError('Minimal 1 kolom Jenis Sampah harus diisi.');
                return;
            }

            setIsSubmitting(true);

            const formattedNamesList = validItems.map((item) => {
                const trimmedName = item.name.trim();
                const w = parseFloat(item.weight);
                if (!isNaN(w) && w > 0) {
                    return `${trimmedName} (${w} kg)`;
                }
                return trimmedName;
            });

            router.post(
                TransactionController.store().url,
                {
                    user_id: data.user_id,
                    sampah_names: formattedNamesList,
                    sampah_name: formattedNamesList.join(', '),
                    total_weight: data.total_weight,
                    custom_price_per_kg: data.custom_price_per_kg,
                    type: 'campur',
                },
                {
                    headers: { 'X-CSRF-TOKEN': csrfToken },
                    onSuccess: () => {
                        setIsSubmitting(false);
                        onOpenChange(false);
                        reset();
                    },
                    onError: (errs) => {
                        setIsSubmitting(false);
                        if (errs.sampah_names) setCustomError(errs.sampah_names);
                    },
                    onFinish: () => setIsSubmitting(false),
                }
            );
        } else {
            // SUBMIT MODE B (SAMPAH PILAH)
            const validPilah = sampahPilahInput.filter(
                (item) => item.name.trim() !== '' && (parseFloat(item.weight) || 0) > 0
            );

            if (validPilah.length === 0) {
                setCustomError('Minimal 1 jenis sampah pilah (isi Nama Jenis Sampah dan Berat) harus diisi.');
                return;
            }

            setIsSubmitting(true);

            const formattedPilahList = validPilah.map((item) => {
                const w = parseFloat(item.weight) || 0;
                const p = parseFloat(item.price_per_kg) || 0;
                const subtotal = Math.round(w * p);
                return `${item.name.trim()} (${w} kg @ Rp ${p.toLocaleString('id-ID')}/kg = Rp ${subtotal.toLocaleString('id-ID')})`;
            });

            const totalWeight = validPilah.reduce((acc, curr) => acc + (parseFloat(curr.weight) || 0), 0);
            const totalIncome = validPilah.reduce(
                (acc, curr) => acc + Math.round((parseFloat(curr.weight) || 0) * (parseFloat(curr.price_per_kg) || 0)),
                0
            );
            const effectivePricePerKg = totalWeight > 0 ? Math.round(totalIncome / totalWeight) : 0;

            router.post(
                TransactionController.store().url,
                {
                    user_id: data.user_id,
                    sampah_names: formattedPilahList,
                    sampah_name: formattedPilahList.join(', '),
                    total_weight: totalWeight.toString(),
                    custom_price_per_kg: effectivePricePerKg.toString(),
                    type: 'pilah',
                },
                {
                    headers: { 'X-CSRF-TOKEN': csrfToken },
                    onSuccess: () => {
                        setIsSubmitting(false);
                        onOpenChange(false);
                        reset();
                    },
                    onError: (errs) => {
                        setIsSubmitting(false);
                        if (errs.sampah_names) setCustomError(errs.sampah_names);
                    },
                    onFinish: () => setIsSubmitting(false),
                }
            );
        }
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
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <Scale className="size-5 text-emerald-600 dark:text-emerald-400" /> POS Setor Sampah
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Pilih mode setoran di bawah ini (Sampah Campur atau Sampah Pilah) untuk mencatat setoran warga.
                    </DialogDescription>
                </DialogHeader>

                {/* MODE FILTER TOGGLE SWITCHER (AT THE VERY TOP) */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-accent/50 p-1 border border-sidebar-border/60 text-xs">
                    <button
                        type="button"
                        onClick={() => {
                            setSetoranMode('campur');
                            setCustomError(null);
                        }}
                        className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 font-bold transition-all ${
                            setoranMode === 'campur'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <PackageCheck className="size-4" /> Sampah Campur (Totalan)
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSetoranMode('pilah');
                            setCustomError(null);
                        }}
                        className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 font-bold transition-all ${
                            setoranMode === 'pilah'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Layers className="size-4" /> Sampah Pilah (Harga/Jenis)
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 py-1">
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

                    {/* MODE A: SAMPAH CAMPUR FORM */}
                    {setoranMode === 'campur' && (
                        <div className="space-y-4">
                            <div className="space-y-3 pt-1">
                                <div className="flex items-center justify-between border-b border-sidebar-border/70 pb-2">
                                    <Label className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                                        <PackageCheck className="size-4 text-emerald-600" />
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

                            {/* Live Calculator Panel Mode A */}
                            <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                                <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                                    <span>Total Uang Diterima Warga:</span>
                                    <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(liveIncomeModeA)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MODE B: SAMPAH PILAH FORM (HARGA & BERAT PER JENIS) */}
                    {setoranMode === 'pilah' && (
                        <div className="space-y-4">
                            <div className="space-y-3 pt-1">
                                <div className="flex items-center justify-between border-b border-sidebar-border/70 pb-2">
                                    <Label className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                                        <Layers className="size-4 text-emerald-600" />
                                        Rincian Sampah Pilah (Harga Per Jenis)
                                    </Label>
                                    {sampahPilahInput.length < 10 && (
                                        <button
                                            type="button"
                                            onClick={handleAddPilahRow}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
                                        >
                                            <Plus className="size-3.5" /> Tambah Jenis Sampah
                                        </button>
                                    )}
                                </div>

                                {customError && <InputError message={customError} />}

                                {/* Input Rows Header Mode B */}
                                <div className="grid grid-cols-12 gap-1.5 text-[11px] font-semibold text-muted-foreground px-1">
                                    <div className="col-span-5">Pilih / Isi Jenis Sampah</div>
                                    <div className="col-span-3">Berat (Kg)</div>
                                    <div className="col-span-3">Harga (Rp/Kg)</div>
                                    <div className="col-span-1 text-center">Hapus</div>
                                </div>

                                <div className="space-y-2.5">
                                    {sampahPilahInput.map((item, idx) => {
                                        const rowW = parseFloat(item.weight) || 0;
                                        const rowP = parseFloat(item.price_per_kg) || 0;
                                        const rowSubtotal = Math.round(rowW * rowP);

                                        return (
                                            <div key={idx} className="space-y-1 rounded-lg border border-sidebar-border/50 bg-accent/30 p-2">
                                                <div className="grid grid-cols-12 gap-1.5 items-center">
                                                    {/* Jenis Sampah Dropdown / Text Input */}
                                                    <div className="col-span-5">
                                                        <input
                                                            list={`sampah-catalog-${idx}`}
                                                            type="text"
                                                            value={item.name}
                                                            onChange={(e) =>
                                                                handlePilahChange(idx, 'name', e.target.value)
                                                            }
                                                            placeholder="Pilih/ketik jenis..."
                                                            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                                                        />
                                                        <datalist id={`sampah-catalog-${idx}`}>
                                                            {sampahItems.map((s) => (
                                                                <option key={s.id} value={s.name}>
                                                                    Rp {s.price_per_kg.toLocaleString('id-ID')}/kg
                                                                </option>
                                                            ))}
                                                        </datalist>
                                                    </div>

                                                    {/* Berat (Kg) */}
                                                    <div className="col-span-3">
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min={0}
                                                            value={item.weight}
                                                            onChange={(e) =>
                                                                handlePilahChange(idx, 'weight', e.target.value)
                                                            }
                                                            placeholder="Berat (kg)"
                                                            className="text-xs font-semibold"
                                                        />
                                                    </div>

                                                    {/* Harga Satuan (Rp/Kg) */}
                                                    <div className="col-span-3">
                                                        <Input
                                                            type="number"
                                                            step="100"
                                                            min={0}
                                                            value={item.price_per_kg}
                                                            onChange={(e) =>
                                                                handlePilahChange(idx, 'price_per_kg', e.target.value)
                                                            }
                                                            placeholder="Rp / kg"
                                                            className="text-xs"
                                                        />
                                                    </div>

                                                    {/* Delete Row Button */}
                                                    <div className="col-span-1 flex justify-center">
                                                        {sampahPilahInput.length > 1 ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemovePilahRow(idx)}
                                                                className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                                                                title="Hapus baris ini"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </button>
                                                        ) : (
                                                            <span className="text-muted-foreground/30 text-xs">-</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Row Subtotal Indicator */}
                                                <div className="flex items-center justify-between text-[11px] px-1 text-muted-foreground">
                                                    <span>Subtotal jenis ini:</span>
                                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                        {formatCurrency(rowSubtotal)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Live Summary Panel Mode B */}
                            <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                                <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                                    <span>Total Massa Sampah Pilah:</span>
                                    <span className="text-sm font-bold text-foreground">
                                        {livePilahTotalWeight} kg
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200 border-t border-emerald-500/20 pt-2">
                                    <span>Total Uang Diterima Warga:</span>
                                    <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(livePilahTotalIncome)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting || processing}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || processing}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                            {isSubmitting || processing ? 'Menyimpan...' : 'Simpan Setoran'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
