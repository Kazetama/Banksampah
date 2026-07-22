import { router } from '@inertiajs/react';
import SampahController from '@/actions/App/Http/Controllers/Admin/SampahController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Sampah } from '@/types';

interface DeleteSampahDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sampah: Sampah | null;
}

export function DeleteSampahDialog({
    open,
    onOpenChange,
    sampah,
}: DeleteSampahDialogProps) {
    const confirmDelete = () => {
        if (sampah) {
            router.delete(SampahController.destroy({ sampah: sampah.id }).url, {
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
                    <DialogTitle className="text-red-500">
                        Hapus Jenis Sampah
                    </DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus jenis sampah{' '}
                        <strong>{sampah?.name}</strong>? Tindakan ini bersifat
                        permanen dan tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
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
