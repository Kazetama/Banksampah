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

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
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
                    <DialogTitle>{user ? 'Edit User Account' : 'Add New User'}</DialogTitle>
                    <DialogDescription>
                        {user
                            ? 'Update user details. Leave password blank if you do not want to change it.'
                            : 'Create a new user account. Fill in all the fields below.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. John Doe"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="e.g. john@example.com"
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={user ? 'Leave blank to keep current' : 'Min. 8 characters'}
                            required={!user}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="role">User Role</Label>
                        <select
                            id="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value as 'super_admin' | 'admin' | 'nasabah')}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="nasabah">Nasabah (Warga)</option>
                            <option value="admin">Admin (Petugas)</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                            id="phone_number"
                            value={data.phone_number}
                            onChange={(e) => setData('phone_number', e.target.value)}
                            placeholder="e.g. 081234567890"
                        />
                        <InputError message={errors.phone_number} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Full home address..."
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <InputError message={errors.address} />
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {user ? 'Update User' : 'Create User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
