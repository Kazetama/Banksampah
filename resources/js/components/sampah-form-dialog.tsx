import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import SampahController from '@/actions/App/Http/Controllers/Admin/SampahController';
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
import type { Sampah, SampahCategory } from '@/types';

interface SampahFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sampah: Sampah | null;
    categories: SampahCategory[];
}

export function SampahFormDialog({ open, onOpenChange, sampah, categories }: SampahFormDialogProps) {
    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        category_id: '' as string | number,
        name: '',
        price_per_kg: 0,
    });

    useEffect(() => {
        if (open) {
            clearErrors();

            if (sampah) {
                setData({
                    category_id: sampah.category_id,
                    name: sampah.name,
                    price_per_kg: sampah.price_per_kg,
                });
            } else {
                reset();

                if (categories.length > 0) {
                    setData('category_id', categories[0].id);
                }
            }
        }
    }, [sampah, open, categories, clearErrors, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (sampah) {
            patch(SampahController.update({ sampah: sampah.id }).url, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post(SampahController.store().url, {
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
                    <DialogTitle>{sampah ? 'Ubah Jenis Sampah' : 'Tambah Jenis Sampah Baru'}</DialogTitle>
                    <DialogDescription>
                        {sampah ? 'Ubah nama, kategori, dan harga per kg untuk jenis sampah ini.' : 'Tambahkan jenis sampah baru ke dalam daftar.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="sampah_name">Nama Barang / Jenis</Label>
                        <Input
                            id="sampah_name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Botol Plastik PET"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Kategori</Label>
                        <select
                            id="category_id"
                            value={data.category_id}
                            onChange={(e) => setData('category_id', Number(e.target.value))}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                            required
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.category_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="price_per_kg">Harga per Kg (Rp)</Label>
                        <Input
                            id="price_per_kg"
                            type="number"
                            value={data.price_per_kg || ''}
                            onChange={(e) => setData('price_per_kg', Number(e.target.value))}
                            placeholder="Contoh: 3000"
                            min={1}
                            required
                        />
                        <InputError message={errors.price_per_kg} />
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {sampah ? 'Simpan Perubahan' : 'Tambah Jenis Sampah'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
