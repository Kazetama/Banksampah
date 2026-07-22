import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import RewardController from '@/actions/App/Http/Controllers/Admin/RewardController';
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

interface RewardFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reward: Reward | null;
}

export function RewardFormDialog({
    open,
    onOpenChange,
    reward,
}: RewardFormDialogProps) {
    const {
        data,
        setData,
        post,
        patch,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        name: '',
        category: '',
        description: '',
        price: 0,
        stock: 0,
    });

    useEffect(() => {
        if (open) {
            clearErrors();

            if (reward) {
                setData({
                    name: reward.name,
                    category: reward.category,
                    description: reward.description || '',
                    price: reward.price,
                    stock: reward.stock,
                });
            } else {
                reset();
            }
        }
    }, [reward, open, clearErrors, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (reward) {
            patch(RewardController.update({ reward: reward.id }).url, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post(RewardController.store().url, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {reward
                            ? 'Ubah Barang Hadiah'
                            : 'Tambah Barang Hadiah Baru'}
                    </DialogTitle>
                    <DialogDescription>
                        {reward
                            ? 'Ubah nama, rincian, biaya poin, dan stok barang hadiah.'
                            : 'Buat barang hadiah baru untuk dapat ditukarkan warga.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="reward_name">Nama Hadiah</Label>
                        <Input
                            id="reward_name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Sembako Paket A"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="reward_category">Kategori</Label>
                        <Input
                            id="reward_category"
                            value={data.category}
                            onChange={(e) =>
                                setData('category', e.target.value)
                            }
                            placeholder="Contoh: Sembako, Elektronik, Alat Tulis"
                            required
                        />
                        <InputError message={errors.category} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="reward_desc">Deskripsi</Label>
                        <textarea
                            id="reward_desc"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Tuliskan keterangan lengkap barang hadiah..."
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reward_price">Biaya (Poin)</Label>
                            <Input
                                id="reward_price"
                                type="number"
                                value={data.price || ''}
                                onChange={(e) =>
                                    setData('price', Number(e.target.value))
                                }
                                placeholder="Contoh: 50"
                                min={1}
                                required
                            />
                            <InputError message={errors.price} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reward_stock">Stok Tersedia</Label>
                            <Input
                                id="reward_stock"
                                type="number"
                                value={
                                    data.stock === 0 ? '0' : data.stock || ''
                                }
                                onChange={(e) =>
                                    setData('stock', Number(e.target.value))
                                }
                                placeholder="Contoh: 10"
                                min={0}
                                required
                            />
                            <InputError message={errors.stock} />
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
                            {reward ? 'Simpan Perubahan' : 'Tambah Hadiah'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
