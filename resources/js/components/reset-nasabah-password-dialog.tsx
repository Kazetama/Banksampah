import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import NasabahController from '@/actions/App/Http/Controllers/Admin/NasabahController';
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
import type { User } from '@/types';

interface ResetNasabahPasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nasabah: User | null;
}

export function ResetNasabahPasswordDialog({ open, onOpenChange, nasabah }: ResetNasabahPasswordDialogProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        password: '',
    });

    useEffect(() => {
        if (open) {
            clearErrors();
            reset();
        }
    }, [open, clearErrors, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (nasabah) {
            post(NasabahController.resetPassword({ user: nasabah.id }).url, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Reset Kata Sandi Nasabah</DialogTitle>
                    <DialogDescription>
                        Mengatur ulang kata sandi untuk warga bernama <strong>{nasabah?.name}</strong>. Masukkan kata sandi baru di bawah ini.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="new_password">Kata Sandi Baru</Label>
                        <Input
                            id="new_password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Minimal 8 karakter"
                            required
                        />
                        <InputError message={errors.password} />
                    </div>
                    <DialogFooter className="mt-4 gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Reset Kata Sandi
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
