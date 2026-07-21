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

export function DeleteUserDialog({ open, onOpenChange, user }: DeleteUserDialogProps) {
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
                    <DialogTitle className="text-red-500">Delete User</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong>{user?.name}</strong>? This action is permanent and cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={confirmDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
