import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import UserController from '@/actions/App/Http/Controllers/SuperAdmin/UserController';
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

interface UserFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export function UserFormDialog({
    open,
    onOpenChange,
    user,
}: UserFormDialogProps) {
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
        email: '',
        password: '',
        role: 'nasabah' as 'super_admin' | 'admin' | 'nasabah',
        address: '',
        phone_number: '',
    });

    useEffect(() => {
        if (open) {
            clearErrors();

            if (user) {
                setData({
                    name: user.name,
                    email: user.email,
                    password: '',
                    role: user.role,
                    address: user.address || '',
                    phone_number: user.phone_number || '',
                });
            } else {
                reset();
            }
        }
    }, [user, open, clearErrors, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            patch(UserController.update({ user: user.id }).url, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post(UserController.store().url, {
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
                        {user ? 'Ubah Akun Pengguna' : 'Tambah Pengguna Baru'}
                    </DialogTitle>
                    <DialogDescription>
                        {user
                            ? 'Perbarui rincian pengguna. Kosongkan kata sandi jika tidak ingin mengubahnya.'
                            : 'Buat akun pengguna baru. Isi semua kolom di bawah ini.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Budi Santoso"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Contoh: budi@gmail.com"
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Kata Sandi (Password)</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder={
                                user
                                    ? 'Kosongkan jika tidak ingin mengubah'
                                    : 'Minimal 8 karakter'
                            }
                            required={!user}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="role">Peran Pengguna (Role)</Label>
                        <select
                            id="role"
                            value={data.role}
                            onChange={(e) =>
                                setData(
                                    'role',
                                    e.target.value as
                                        'super_admin' | 'admin' | 'nasabah',
                                )
                            }
                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
                        >
                            <option value="nasabah">Nasabah (Warga)</option>
                            <option value="admin">Admin (Petugas)</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone_number">Nomor Telepon</Label>
                        <Input
                            id="phone_number"
                            value={data.phone_number}
                            onChange={(e) =>
                                setData('phone_number', e.target.value)
                            }
                            placeholder="Contoh: 081234567890"
                        />
                        <InputError message={errors.phone_number} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Alamat Rumah</Label>
                        <textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Alamat rumah lengkap..."
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
                        />
                        <InputError message={errors.address} />
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
                            {user ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
