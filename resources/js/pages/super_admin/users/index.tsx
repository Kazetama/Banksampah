import { Head, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DeleteUserDialog } from '@/components/delete-user-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserFormDialog } from '@/components/user-form-dialog';
import superAdmin from '@/routes/super_admin';
import type { User, PaginatedData } from '@/types';

interface IndexProps {
    users: PaginatedData<User>;
    filters: {
        search?: string;
        role?: string;
    };
}

export default function Index({ users, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Debounce search and filter updates
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (
                search !== (filters.search || '') ||
                roleFilter !== (filters.role || 'all')
            ) {
                router.get(
                    superAdmin.users.index().url,
                    { search, role: roleFilter },
                    { preserveState: true, replace: true },
                );
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search, roleFilter, filters.search, filters.role]);

    const handleCreateClick = () => {
        setUserToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (user: User) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setIsDeleteOpen(true);
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'super_admin':
                return (
                    <Badge className="border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20">
                        Super Admin
                    </Badge>
                );
            case 'admin':
                return (
                    <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                        Admin
                    </Badge>
                );
            default:
                return (
                    <Badge className="border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        Nasabah
                    </Badge>
                );
        }
    };

    return (
        <>
            <Head title="Manajemen Pengguna" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 border-b border-sidebar-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Manajemen Pengguna
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Mengelola akun, peran (role), alamat, dan hak akses
                            pengguna.
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateClick}
                        className="w-full gap-2 sm:w-auto"
                    >
                        <Plus className="size-4" /> Tambah Pengguna Baru
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari berdasarkan nama atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
                        >
                            <option value="all">Semua Peran (Role)</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Admin (Petugas)</option>
                            <option value="nasabah">Nasabah (Warga)</option>
                        </select>
                    </div>
                </div>

                {/* Datatable */}
                <div className="min-h-[400px] flex-1 overflow-x-auto rounded-lg border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-sidebar-border/70 bg-sidebar text-xs uppercase dark:border-sidebar-border dark:bg-neutral-900">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Pengguna
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Peran
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Nomor Telepon
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Alamat
                                </th>
                                <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                            {users.data.length > 0 ? (
                                users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="transition-colors hover:bg-accent/40"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {user.phone_number || '-'}
                                        </td>
                                        <td className="max-w-xs truncate px-6 py-4 text-muted-foreground">
                                            {user.address || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleEditClick(user)
                                                    }
                                                    className="size-8"
                                                >
                                                    <Edit className="size-3.5" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDeleteClick(user)
                                                    }
                                                    className="size-8 border-red-500/10 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-muted-foreground"
                                    >
                                        Pengguna tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.total > users.per_page && (
                    <div className="flex flex-col gap-4 border-t border-sidebar-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                        <div className="text-center text-xs text-muted-foreground sm:text-left">
                            Menampilkan {users.from} hingga {users.to} dari{' '}
                            {users.total} pengguna
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                            {users.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (link.url) {
                                            router.get(
                                                link.url,
                                                { search, role: roleFilter },
                                                {
                                                    preserveState: true,
                                                    replace: true,
                                                },
                                            );
                                        }
                                    }}
                                    disabled={!link.url}
                                    className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                                        link.active
                                            ? 'border-transparent bg-primary font-medium text-primary-foreground'
                                            : 'border-sidebar-border/70 text-foreground hover:bg-accent dark:border-sidebar-border'
                                    } ${!link.url ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit User Dialog Modal */}
            <UserFormDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                user={userToEdit}
            />

            {/* Confirm Delete Dialog */}
            <DeleteUserDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                user={userToDelete}
            />
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen Pengguna',
            href: '#',
        },
    ],
};
