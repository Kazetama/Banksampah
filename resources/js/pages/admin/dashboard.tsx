import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    PlusCircle,
    Scale,
    TrendingUp,
    Users,
    Receipt,
} from 'lucide-react';
import admin from '@/routes/admin';
import type { User } from '@/types';

interface Transaction {
    id: number;
    total_weight: number;
    total_income: number;
    created_at: string;
    user: User;
    sampah: {
        name: string;
        price_per_kg: number;
    };
}

interface DashboardProps {
    stats: {
        transactions_today: number;
        weight_today: number;
        income_today: number;
        total_weight_all: number;
        total_income_all: number;
        total_nasabah: number;
    };
    recent_transactions: Transaction[];
}

export default function Dashboard({
    stats,
    recent_transactions,
}: DashboardProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);

        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);

    return (
        <>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header with Quick Shortcuts */}
                <div className="flex flex-col gap-4 border-b border-sidebar-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Dashboard Pencatatan Setoran
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ringkasan operasional penimbangan sampah & rekap transaksi.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={admin.transactions.index().url}>
                            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                                <PlusCircle className="size-4" /> POS & Rekap Setoran
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                Transaksi Hari Ini
                            </span>
                            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                                <Receipt className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-foreground">
                                {stats.transactions_today}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                                setoran dicatat hari ini
                            </span>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                Berat Disetor Hari Ini
                            </span>
                            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                                <Scale className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-foreground">
                                {stats.weight_today} kg
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                                total massa hari ini
                            </span>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                Pendapatan Hari Ini
                            </span>
                            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                                <TrendingUp className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-xl font-bold text-emerald-600">
                                {formatCurrency(stats.income_today)}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                                nominal transaksi hari ini
                            </span>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                Nasabah Terdaftar
                            </span>
                            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
                                <Users className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-foreground">
                                {stats.total_nasabah}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                                total warga nasabah
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions List */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-foreground">
                                5 Setoran Sampah Terakhir
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Transaksi setoran yang baru saja Anda catat.
                            </p>
                        </div>
                        <Link
                            href={admin.transactions.index().url}
                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                            Lihat Rekap Lengkap & Export <ArrowRight className="size-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                        {recent_transactions.length > 0 ? (
                            recent_transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between py-3"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">
                                            {tx.user.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {tx.total_weight} kg ({tx.sampah?.name ?? 'Sampah'})
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-emerald-500">
                                            {formatCurrency(tx.total_income)}
                                        </span>
                                        <span className="block text-[10px] text-muted-foreground">
                                            Pukul {formatDate(tx.created_at)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                Belum ada setoran tercatat.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

// Inline button component helper to avoid components created inside render
function Button({
    children,
    className = '',
    variant = 'default',
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'outline';
}) {
    const baseStyle =
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 cursor-pointer';
    const variantStyle =
        variant === 'default'
            ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
            : 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground';

    return (
        <button
            className={`${baseStyle} ${variantStyle} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: admin.dashboard().url,
        },
    ],
};
