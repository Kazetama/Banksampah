import { useForm } from '@inertiajs/react';
import { Gift } from 'lucide-react';
import { useEffect } from 'react';
import NasabahRewardController from '@/actions/App/Http/Controllers/Nasabah/RewardController';
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
import type { Reward } from '@/types';

interface ClaimRewardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reward: Reward | null;
    totalPoints: number;
}

export function ClaimRewardDialog({ open, onOpenChange, reward, totalPoints }: ClaimRewardDialogProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        reward_id: 0,
        quantity: 1,
    });

    useEffect(() => {
        if (open && reward) {
            clearErrors();
            setData({ reward_id: reward.id, quantity: 1 });
        }
    }, [open, reward, clearErrors, setData]);

    const totalCost = reward ? reward.price * data.quantity : 0;
    const remaining = totalPoints - totalCost;
    const isAffordable = remaining >= 0;
    const isStockSufficient = reward ? data.quantity <= reward.stock : false;
    const canSubmit = isAffordable && isStockSufficient && data.quantity >= 1;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(NasabahRewardController.store().url, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Gift className="size-5 text-primary" /> Klaim Hadiah
                    </DialogTitle>
                    <DialogDescription>
                        Tukarkan poin Anda dengan hadiah{reward ? `: ${reward.name}` : ''}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Info Hadiah */}
                    {reward && (
                        <div className="rounded-lg border border-sidebar-border/70 dark:border-sidebar-border bg-sidebar dark:bg-neutral-900 p-4 space-y-1.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Harga per unit</span>
                                <span className="font-semibold text-amber-500">{reward.price.toLocaleString('id-ID')} poin</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Stok tersedia</span>
                                <span className="font-medium text-foreground">{reward.stock} unit</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Saldo poin Anda</span>
                                <span className="font-semibold text-foreground">{totalPoints.toLocaleString('id-ID')} poin</span>
                            </div>
                        </div>
                    )}

                    {/* Jumlah */}
                    <div className="grid gap-2">
                        <Label htmlFor="quantity">Jumlah yang Diklaim</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min={1}
                            max={reward?.stock ?? 1}
                            value={data.quantity}
                            onChange={(e) => setData('quantity', parseInt(e.target.value) || 1)}
                            required
                        />
                        <InputError message={errors.quantity} />
                    </div>

                    {/* Live Kalkulasi */}
                    <div className={`rounded-lg p-4 space-y-2 border ${isAffordable ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Total Poin Digunakan</span>
                            <span className="font-bold text-amber-500">{totalCost.toLocaleString('id-ID')} poin</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Sisa Poin Setelah Klaim</span>
                            <span className={`font-bold ${isAffordable ? 'text-emerald-500' : 'text-red-500'}`}>
                                {remaining.toLocaleString('id-ID')} poin
                            </span>
                        </div>
                        {!isAffordable && (
                            <p className="text-xs text-red-500 font-medium">Saldo poin tidak mencukupi.</p>
                        )}
                        {!isStockSufficient && data.quantity > 1 && (
                            <p className="text-xs text-red-500 font-medium">Jumlah melebihi stok tersedia ({reward?.stock} unit).</p>
                        )}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing || !canSubmit}>
                            Ajukan Klaim
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
