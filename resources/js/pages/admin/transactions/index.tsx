import { Head, router } from '@inertiajs/react';
import { Download, Eye, PlusCircle, Scale, Search, TrendingUp, Receipt } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DepositPosDialog } from '@/components/deposit-pos-dialog';
import { TransactionDetailDialog } from '@/components/transaction-detail-dialog';
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
    created_at: string;
    user: User;
    admin: User;
    sampah: Sampah;
}

interface RekapStats {
    total_transactions: number;
    total_weight: number;
    total_income: number;
}

interface IndexProps {
    transactions: PaginatedData<Transaction>;
    nasabahs: User[];
    sampahItems: Sampah[];
    rekap: RekapStats;
    filters: {
        search?: string;
    };
}

export default function Index({
    transactions,
    nasabahs,
    sampahItems,
    rekap,
    filters,
}: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isPosOpen, setIsPosOpen] = useState(false);
    const [selectedDetailTx, setSelectedDetailTx] = useState<Transaction | null>(null);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    admin.transactions.index().url,
                    { search },
                    { preserveState: true, replace: true },
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

    const handleExport = () => {
        window.location.href = admin.transactions.export().url;
    };

    return (
        <>
            <Head title="POS & Rekap Setoran Sampah" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-sidebar-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            POS & Rekap Setoran Sampah
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pencatatan setoran sampah warga dan rekapitulasi data transaksi.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            onClick={handleExport}
                            variant="outline"
                            className="gap-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                        >
                            <Download className="size-4" /> Export Excel (CSV)
                        </Button>
                        <Button
                            onClick={() => setIsPosOpen(true)}
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            <PlusCircle className="size-4" /> Catat Setoran Baru
                        </Button>
                    </div>
                </div>

                {/* Rekap Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-500">
                                <Receipt className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Total Rekap Transaksi
                                </p>
                                <p className="text-xl font-bold text-foreground">
                                    {rekap.total_transactions} transaksi
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500">
                                <Scale className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Total Massa Sampah (KG)
                                </p>
                                <p className="text-xl font-bold text-foreground">
                                    {rekap.total_weight} kg
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-600">
                                <TrendingUp className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Total Uang Disalurkan
                                </p>
                                <p className="text-xl font-bold text-emerald-600">
                                    {formatCurrency(rekap.total_income)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="relative">
                    <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari setoran berdasarkan nama warga..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Datatable */}
                <div className="overflow-x-auto rounded-lg border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-sidebar-border/70 bg-sidebar text-xs uppercase dark:border-sidebar-border dark:bg-neutral-900">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Waktu Setor
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Nasabah (Warga)
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Jenis Sampah
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Berat (KG)
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Harga Satuan (Rp/KG)
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Total Uang (Rp)
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Petugas Pencatat
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground text-center">
                                    Aksi / Detail
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                            {transactions.data.length > 0 ? (
                                transactions.data.map((tx) => {
                                    const pricePerKg = tx.total_weight > 0 ? Math.round(tx.total_income / tx.total_weight) : 0;
                                    return (
                                        <tr
                                            key={tx.id}
                                            className="transition-colors hover:bg-accent/40"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                                {formatDate(tx.created_at)}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                {tx.user
                                                    ? tx.user.name
                                                    : `Warga ID: ${tx.user_id}`}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {tx.sampah
                                                    ? tx.sampah.name
                                                    : 'Sampah'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-foreground">
                                                {tx.total_weight} kg
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                                {formatCurrency(pricePerKg)} /kg
                                            </td>
                                            <td className="px-6 py-4 font-bold whitespace-nowrap text-emerald-600">
                                                {formatCurrency(tx.total_income)}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {tx.admin ? tx.admin.name : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedDetailTx(tx)}
                                                    className="gap-1.5 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400"
                                                >
                                                    <Eye className="size-3.5" /> Detail
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center text-muted-foreground"
                                    >
                                        Transaksi setoran tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {transactions.total > transactions.per_page && (
                    <div className="flex flex-col gap-4 border-t border-sidebar-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                        <div className="text-center text-xs text-muted-foreground sm:text-left">
                            Menampilkan {transactions.from} hingga{' '}
                            {transactions.to} dari {transactions.total}{' '}
                            transaksi
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

            {/* Quick POS Dialog */}
            <DepositPosDialog
                open={isPosOpen}
                onOpenChange={setIsPosOpen}
                nasabahs={nasabahs}
                sampahItems={sampahItems}
            />

            {/* Transaction Detail Modal */}
            <TransactionDetailDialog
                open={!!selectedDetailTx}
                onOpenChange={(open) => !open && setSelectedDetailTx(null)}
                transaction={selectedDetailTx}
            />
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'POS & Rekap Setoran',
            href: admin.transactions.index().url,
        },
    ],
};

