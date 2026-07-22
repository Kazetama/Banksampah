import { useForm } from '@inertiajs/react';
import { Scale, Search, UserCheck } from 'lucide-react';
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

export function DepositPosDialog({
    open,
    onOpenChange,
    nasabahs,
    sampahItems,
}: DepositPosDialogProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            user_id: '' as string | number,
            sampah_name: '',
            total_weight: '',
            custom_price_per_kg: '',
        });

    const [nasabahSearch, setNasabahSearch] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initial setup when modal opens
    useEffect(() => {
        if (open) {
            clearErrors();
            reset();
            setNasabahSearch('');
            setIsDropdownOpen(false);

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

    // Live calculation computed on render
    const weightVal = parseFloat(data.total_weight) || 0;
    const priceVal = parseFloat(data.custom_price_per_kg) || 0;
    const liveIncome = Math.round(weightVal * priceVal);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(TransactionController.store().url, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Scale className="size-5 text-primary" /> POS Setor
                        Sampah
                    </DialogTitle>
                    <DialogDescription>
                        Mencatat transaksi setoran sampah baru untuk
                        nasabah/warga dengan jenis sampah & harga bebas.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Searchable Nasabah Picker */}
                    <div className="relative grid gap-2" ref={dropdownRef}>
                        <Label htmlFor="nasabah_search">Nasabah (Warga)</Label>
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
                                className="pr-9"
                            />
                            <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                        </div>

                        {selectedNasabah && (
                            <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs">
                                <div className="flex items-center gap-1.5 font-medium text-emerald-900 dark:text-emerald-200">
                                    <UserCheck className="size-4 shrink-0 text-emerald-600" />
                                    <span>{selectedNasabah.name}</span>
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
                                            className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-xs transition-colors hover:bg-accent hover:text-accent-foreground ${
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

                    <div className="grid gap-2">
                        <Label htmlFor="sampah_name">Jenis Sampah (Input Bebas)</Label>
                        <Input
                            id="sampah_name"
                            type="text"
                            value={data.sampah_name}
                            onChange={(e) =>
                                setData('sampah_name', e.target.value)
                            }
                            placeholder="Contoh: Kardus, Botol Plastik, Besi, dll..."
                            required
                        />
                        <InputError message={errors.sampah_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="total_weight">Berat Sampah (Kg)</Label>
                        <Input
                            id="total_weight"
                            type="number"
                            step="0.1"
                            value={data.total_weight}
                            onChange={(e) =>
                                setData('total_weight', e.target.value)
                            }
                            placeholder="Contoh: 5.5"
                            min={0.1}
                            required
                        />
                        <InputError message={errors.total_weight} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="custom_price_per_kg">
                            Harga Satuan Pengepul (Rp / Kg)
                        </Label>
                        <Input
                            id="custom_price_per_kg"
                            type="number"
                            step="100"
                            value={data.custom_price_per_kg}
                            onChange={(e) =>
                                setData('custom_price_per_kg', e.target.value)
                            }
                            placeholder="Masukkan harga per kg..."
                            min={0}
                            required
                        />
                        <p className="text-[11px] text-muted-foreground">
                            Bisa diubah sesuai patokan harga pengepul Anda.
                        </p>
                    </div>

                    {/* Live Calculator Panel */}
                    <div className="space-y-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="font-medium">Total Uang Diterima Warga:</span>
                            <span className="text-base font-bold text-emerald-600">
                                {formatCurrency(liveIncome)}
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Simpan Setoran
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
