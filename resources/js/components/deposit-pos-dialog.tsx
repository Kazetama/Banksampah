import { useForm } from '@inertiajs/react';
import { Scale } from 'lucide-react';
import { useEffect } from 'react';
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

export function DepositPosDialog({ open, onOpenChange, nasabahs, sampahItems }: DepositPosDialogProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        user_id: '' as string | number,
        sampah_id: '' as string | number,
        total_weight: '',
    });

    // Initial setup when modal opens
    useEffect(() => {
        if (open) {
            clearErrors();
            reset();
            
            if (nasabahs.length > 0) {
                setData('user_id', nasabahs[0].id);
            }

            if (sampahItems.length > 0) {
                setData('sampah_id', sampahItems[0].id);
            }
        }
    }, [open, nasabahs, sampahItems, clearErrors, reset, setData]);

    // Live calculation computed on render (no state synchronization required)
    const weightVal = parseFloat(data.total_weight);
    let liveIncome = 0;
    let livePoints = 0;

    if (data.sampah_id && !isNaN(weightVal) && weightVal > 0) {
        const selectedItem = sampahItems.find((s) => s.id === Number(data.sampah_id));

        if (selectedItem) {
            liveIncome = Math.floor(weightVal * selectedItem.price_per_kg);
            livePoints = Math.floor(liveIncome / 1000);
        }
    }

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
                        <Scale className="size-5 text-primary" /> POS Setor Sampah
                    </DialogTitle>
                    <DialogDescription>
                        Mencatat transaksi setoran sampah baru untuk nasabah/warga.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="user_id">Nasabah (Warga)</Label>
                        <select
                            id="user_id"
                            value={data.user_id}
                            onChange={(e) => setData('user_id', Number(e.target.value))}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                            required
                        >
                            {nasabahs.map((n) => (
                                <option key={n.id} value={n.id}>
                                    {n.name} ({n.email})
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.user_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sampah_id">Jenis Sampah</Label>
                        <select
                            id="sampah_id"
                            value={data.sampah_id}
                            onChange={(e) => setData('sampah_id', Number(e.target.value))}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                            required
                        >
                            {sampahItems.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({formatCurrency(s.price_per_kg)}/kg)
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.sampah_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="total_weight">Berat Sampah (Kg)</Label>
                        <Input
                            id="total_weight"
                            type="number"
                            step="0.1"
                            value={data.total_weight}
                            onChange={(e) => setData('total_weight', e.target.value)}
                            placeholder="Contoh: 5.5"
                            min={0.1}
                            required
                        />
                        <InputError message={errors.total_weight} />
                    </div>

                    {/* Live Calculator Panel */}
                    <div className="rounded-lg bg-sidebar dark:bg-neutral-900 border border-sidebar-border/70 p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Estimasi Pendapatan</span>
                            <span className="font-semibold text-foreground">{formatCurrency(liveIncome)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Poin yang Diterima</span>
                            <span className="font-bold text-emerald-500">{livePoints} poin</span>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
