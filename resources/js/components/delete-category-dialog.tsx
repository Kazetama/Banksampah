import { router } from '@inertiajs/react';
import SampahCategoryController from '@/actions/App/Http/Controllers/Admin/SampahCategoryController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { SampahCategory } from '@/types';

interface DeleteCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: SampahCategory | null;
}

export function DeleteCategoryDialog({ open, onOpenChange, category }: DeleteCategoryDialogProps) {
    const confirmDelete = () => {
        if (category) {
            router.delete(SampahCategoryController.destroy({ sampah_category: category.id }).url, {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-red-500">Hapus Kategori</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus kategori <strong>{category?.name}</strong>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={confirmDelete}>
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
