import { router } from '@inertiajs/react';
import RewardController from '@/actions/App/Http/Controllers/Admin/RewardController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Reward } from '@/types';

interface DeleteRewardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reward: Reward | null;
}

export function DeleteRewardDialog({ open, onOpenChange, reward }: DeleteRewardDialogProps) {
    const confirmDelete = () => {
        if (reward) {
            router.delete(RewardController.destroy({ reward: reward.id }).url, {
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
                    <DialogTitle className="text-red-500">Hapus Barang Hadiah</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus barang hadiah <strong>{reward?.name}</strong>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
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
