import { Head, router } from '@inertiajs/react';
import { KeyRound, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ResetNasabahPasswordDialog } from '@/components/reset-nasabah-password-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import admin from '@/routes/admin';
import type { User, PaginatedData } from '@/types';

interface IndexProps {
    nasabahs: PaginatedData<User>;
    filters: {
        search?: string;
    };
}

export default function Index({ nasabahs, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [selectedNasabah, setSelectedNasabah] = useState<User | null>(null);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    admin.nasabah.index().url,
                    { search },
                    { preserveState: true, replace: true }
                );
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search, filters.search]);

    const handleResetClick = (nasabah: User) => {
        setSelectedNasabah(nasabah);
        setIsResetOpen(true);
    };

    return (
        <>
            <Head title="Direktori Warga" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Direktori Warga</h1>
                    <p className="text-sm text-muted-foreground mt-1">Memantau warga terdaftar, saldo poin tabungan, dan reset kata sandi.</p>
                </div>

                {/* Filters */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari warga berdasarkan nama atau email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Datatable */}
                <div className="border border-sidebar-border/70 dark:border-sidebar-border rounded-lg overflow-x-auto bg-card">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-sidebar dark:bg-neutral-900 border-b border-sidebar-border/70 dark:border-sidebar-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Nama</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Email</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Saldo (Poin)</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Nomor Telepon</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Alamat</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                            {nasabahs.data.length > 0 ? (
                                nasabahs.data.map((nasabah) => (
                                    <tr key={nasabah.id} className="hover:bg-accent/40 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{nasabah.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{nasabah.email}</td>
                                        <td className="px-6 py-4 font-semibold text-foreground">
                                            {nasabah.points ? (nasabah.points.total_points as number) : 0} poin
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {nasabah.phone_number || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                                            {nasabah.address || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleResetClick(nasabah)}
                                                className="gap-1.5"
                                            >
                                                <KeyRound className="size-3.5" /> Reset Sandi
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        Warga tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {nasabahs.total > nasabahs.per_page && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                        <div className="text-xs text-muted-foreground text-center sm:text-left">
                            Menampilkan {nasabahs.from} hingga {nasabahs.to} dari {nasabahs.total} warga
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                            {nasabahs.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (link.url) {
                                            router.get(
                                                link.url,
                                                { search },
                                                { preserveState: true, replace: true }
                                            );
                                        }
                                    }}
                                    disabled={!link.url}
                                    className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground border-transparent font-medium'
                                            : 'hover:bg-accent text-foreground border-sidebar-border/70 dark:border-sidebar-border'
                                    } ${!link.url ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Reset Password Dialog */}
            <ResetNasabahPasswordDialog open={isResetOpen} onOpenChange={setIsResetOpen} nasabah={selectedNasabah} />
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Direktori Warga',
            href: admin.nasabah.index().url,
        },
    ],
};
