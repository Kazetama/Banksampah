import { Head } from '@inertiajs/react';
import { Leaf, TrendingUp } from 'lucide-react';
import nasabah from '@/routes/nasabah';
import type { Sampah, User } from '@/types';

interface Transaction {
    id: number;
    total_weight: number;
    total_income: number;
    created_at: string;
    sampah?: Sampah;
    admin?: User;
}

interface DashboardStats {
    total_income: number;
    total_weight: number;
}

interface DashboardProps {
    stats: DashboardStats;
    recent_transactions: Transaction[];
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

export default function Dashboard({
    stats,
    recent_transactions,
}: DashboardProps) {
    const statCards = [
        {
            label: 'Total Pendapatan Rupiah',
            value: formatCurrency(stats.total_income),
            icon: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
        },
        {
            label: 'Total Berat Setoran',
            value: `${stats.total_weight} kg`,
            icon: Leaf,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
        },
    ];

    return (
        <>
            <Head title="Dashboard Nasabah" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Dashboard Saya
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Pantau pendapatan rupiah dan riwayat setoran sampah Anda.
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {statCards.map((card) => (
                        <div
                            key={card.label}
                            className={`rounded-xl border ${card.border} flex items-center gap-4 bg-card p-5 shadow-xs`}
                        >
                            <div
                                className={`rounded-lg ${card.bg} shrink-0 p-3`}
                            >
                                <card.icon className={`size-6 ${card.color}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground">
                                    {card.label}
                                </p>
                                <p
                                    className={`mt-0.5 text-xl font-bold ${card.color} truncate`}
                                >
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Transactions */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-base font-semibold text-foreground">
                        5 Setoran Terakhir
                    </h2>
                    <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-sidebar-border/70 bg-sidebar text-xs uppercase dark:border-sidebar-border dark:bg-neutral-900">
                                <tr>
                                    <th className="px-5 py-3 font-semibold text-muted-foreground">
                                        Tanggal
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-muted-foreground">
                                        Jenis Sampah
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-muted-foreground">
                                        Berat (KG)
                                    </th>
                                    <th className="px-5 py-3 font-semibold text-muted-foreground">
                                        Uang Diterima (Rp)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                                {recent_transactions.length > 0 ? (
                                    recent_transactions.map((tx) => (
                                        <tr
                                            key={tx.id}
                                            className="transition-colors hover:bg-accent/40"
                                        >
                                            <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                                                {formatDate(tx.created_at)}
                                            </td>
                                            <td className="px-5 py-3 font-medium text-foreground">
                                                {tx.sampah?.name ?? 'Sampah'}
                                            </td>
                                            <td className="px-5 py-3 font-semibold text-foreground">
                                                {tx.total_weight} kg
                                            </td>
                                            <td className="px-5 py-3 font-bold whitespace-nowrap text-emerald-500">
                                                {formatCurrency(
                                                    tx.total_income,
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-5 py-10 text-center text-muted-foreground"
                                        >
                                            Belum ada setoran sampah. Yuk mulai
                                            menabung sampah!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: nasabah.dashboard().url,
        },
    ],
};
