import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import nasabah from '@/routes/nasabah';
import type { Sampah, User, PaginatedData } from '@/types';

interface Transaction {
    id: number;
    total_weight: number;
    total_income: number;
    point_received: number;
    created_at: string;
    sampah?: Sampah;
    admin?: User;
}

interface TransactionsProps {
    transactions: PaginatedData<Transaction>;
    filters: { search?: string };
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

export default function Transactions({ transactions, filters }: TransactionsProps) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(nasabah.transactions.index().url, { search }, { preserveState: true, replace: true });
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [search, filters.search]);

    return (
        <>
            <Head title="Riwayat Setoran" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Riwayat Setoran Sampah</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Daftar semua setoran sampah Anda beserta perolehan rupiah dan poin.
                    </p>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari berdasarkan jenis sampah..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Table */}
                <div className="border border-sidebar-border/70 dark:border-sidebar-border rounded-lg overflow-x-auto bg-card">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-sidebar dark:bg-neutral-900 border-b border-sidebar-border/70 dark:border-sidebar-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Tanggal</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Jenis Sampah</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Berat</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Uang Diterima</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Poin Diperoleh</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Dicatat Oleh</th>
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
                                            {tx.sampah?.name ?? 'Sampah'}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{tx.total_weight} kg</td>
                                        <td className="px-6 py-4 font-semibold text-emerald-500 whitespace-nowrap">
                                            {formatCurrency(tx.total_income)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-amber-500">
                                            +{tx.point_received} poin
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {tx.admin?.name ?? 'Petugas'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        Belum ada riwayat setoran yang ditemukan.
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
                            Menampilkan {transactions.from} hingga {transactions.to} dari {transactions.total} setoran
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                            {transactions.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (link.url) {
                                            router.get(link.url, { search }, { preserveState: true, replace: true });
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
        </>
    );
}

Transactions.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: nasabah.dashboard().url },
        { title: 'Riwayat Setoran', href: nasabah.transactions.index().url },
    ],
};
