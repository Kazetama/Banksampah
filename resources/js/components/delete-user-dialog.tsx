import { router } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/SuperAdmin/UserController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { User } from '@/types';

interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export function DeleteUserDialog({
    open,
    onOpenChange,
    user,
}: DeleteUserDialogProps) {
    const confirmDelete = () => {
        if (user) {
            router.delete(UserController.destroy({ user: user.id }).url, {
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
                        Hapus Pengguna
                    </DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus{' '}
                        <strong>{user?.name}</strong>? Tindakan ini bersifat
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
