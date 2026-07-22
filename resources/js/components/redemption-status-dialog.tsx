import { router } from '@inertiajs/react';
import TukarPoinController from '@/actions/App/Http/Controllers/Admin/TukarPoinController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { TukarPoin } from '@/types';

interface RedemptionStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    redemption: TukarPoin | null;
    statusToSet: 'process' | 'done' | 'rejected' | null;
}

export function RedemptionStatusDialog({
    open,
    onOpenChange,
    redemption,
    statusToSet,
}: RedemptionStatusDialogProps) {
    const handleConfirm = () => {
        if (redemption && statusToSet) {
            router.patch(
                TukarPoinController.updateStatus({
                    tukarPoin: redemption.id,
                }).url,
                { status: statusToSet },
                {
                    onSuccess: () => {
                        onOpenChange(false);
                    },
                },
            );
        }
    };

    const getActionVerb = (status: typeof statusToSet) => {
        switch (status) {
            case 'process':
                return 'memproses';
            case 'done':
                return 'menyetujui';
            case 'rejected':
                return 'menolak';
            default:
                return 'memperbarui';
        }
    };

    const getConfirmButtonVariant = (status: typeof statusToSet) => {
        switch (status) {
            case 'rejected':
                return 'destructive';
            case 'done':
                return 'default';
            default:
                return 'outline';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Konfirmasi Tindakan</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin {getActionVerb(statusToSet)}{' '}
                        pengajuan penukaran poin dari{' '}
                        <strong>{redemption?.user?.name}</strong> (hadiah:{' '}
                        {redemption?.reward?.name})?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        variant={getConfirmButtonVariant(statusToSet)}
                        onClick={handleConfirm}
                    >
                        Ya, Konfirmasi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
