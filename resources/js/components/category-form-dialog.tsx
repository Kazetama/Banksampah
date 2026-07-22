import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import SampahCategoryController from '@/actions/App/Http/Controllers/Admin/SampahCategoryController';
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
import type { SampahCategory } from '@/types';

interface CategoryFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: SampahCategory | null;
}

export function CategoryFormDialog({
    open,
    onOpenChange,
    category,
}: CategoryFormDialogProps) {
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
        description: '',
    });

    useEffect(() => {
        if (open) {
            clearErrors();

            if (category) {
                setData({
                    name: category.name,
                    description: category.description || '',
                });
            } else {
                reset();
            }
        }
    }, [category, open, clearErrors, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (category) {
            patch(
                SampahCategoryController.update({
                    sampah_category: category.id,
                }).url,
                {
                    onSuccess: () => {
                        onOpenChange(false);
                        reset();
                    },
                },
            );
        } else {
            post(SampahCategoryController.store().url, {
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
                        {category ? 'Ubah Kategori' : 'Tambah Kategori Baru'}
                    </DialogTitle>
                    <DialogDescription>
                        {category
                            ? 'Ubah nama dan deskripsi kategori sampah.'
                            : 'Buat kategori sampah baru.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="category_name">Nama Kategori</Label>
                        <Input
                            id="category_name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Plastik"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="category_desc">Deskripsi</Label>
                        <textarea
                            id="category_desc"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Contoh: Kategori untuk botol plastik, gelas kemasan, dll..."
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
                        />
                        <InputError message={errors.description} />
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
                            {category ? 'Simpan Perubahan' : 'Tambah Kategori'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
