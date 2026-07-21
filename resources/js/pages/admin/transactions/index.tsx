import { Head, router } from '@inertiajs/react';
import { PlusCircle, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DepositPosDialog } from '@/components/deposit-pos-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import admin from '@/routes/admin';
import type { User, Sampah, PaginatedData } from '@/types';

interface Transaction {
    id: number;
    user_id: number;
    admin_id: number;
    sampah_id: number;
    total_weight: number;
    total_income: number;
    point_received: number;
    created_at: string;
    user: User;
    admin: User;
    sampah: Sampah;
}

interface IndexProps {
    transactions: PaginatedData<Transaction>;
    nasabahs: User[];
    sampahItems: Sampah[];
    filters: {
        search?: string;
    };
}

export default function Index({ transactions, nasabahs, sampahItems, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isPosOpen, setIsPosOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    admin.transactions.index().url,
                    { search },
                    { preserveState: true, replace: true }
                );
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search, filters.search]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);

        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title="POS Setor Sampah" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">POS Setor Sampah</h1>
                        <p className="text-sm text-muted-foreground mt-1">Mencatat setoran berat timbangan sampah dari warga dan melihat riwayat transaksi.</p>
                    </div>
                    <Button onClick={() => setIsPosOpen(true)} className="gap-2">
                        <PlusCircle className="size-4" /> POS Setor Sampah
                    </Button>
                </div>

                {/* Filters */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari setoran berdasarkan nama warga..."
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
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Waktu</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Nasabah (Warga)</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Jenis Sampah</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Berat</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Uang Diterima (Rp)</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Perolehan Poin</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Petugas Pencatat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                            {transactions.data.length > 0 ? (
                                transactions.data.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-accent/40 transition-colors">
                                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                            {formatDate(tx.created_at)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {tx.user ? tx.user.name : `Warga ID: ${tx.user_id}`}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {tx.sampah ? tx.sampah.name : 'Sampah Tidak Dikenal'}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                            {tx.total_weight} kg
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-emerald-500 whitespace-nowrap">
                                            {formatCurrency(tx.total_income)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-foreground">
                                            +{tx.point_received} poin
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {tx.admin ? tx.admin.name : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                        Transaksi setoran tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {transactions.total > transactions.per_page && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                        <div className="text-xs text-muted-foreground text-center sm:text-left">
                            Menampilkan {transactions.from} hingga {transactions.to} dari {transactions.total} transaksi
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                            {transactions.links.map((link, idx) => (
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

            {/* Quick POS Dialog */}
            <DepositPosDialog
                open={isPosOpen}
                onOpenChange={setIsPosOpen}
                nasabahs={nasabahs}
                sampahItems={sampahItems}
            />
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'POS Setor Sampah',
            href: admin.transactions.index().url,
        },
    ],
};
