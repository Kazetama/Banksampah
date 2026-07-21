import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Award, CheckCircle, ArrowRight, PlusCircle, Scale, Users } from 'lucide-react';
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

interface RewardItem {
    id: number;
    name: string;
    stock: number;
    price: number;
}

interface DashboardProps {
    stats: {
        transactions_today: number;
        weight_today: number;
        pending_redemptions: number;
        total_nasabah: number;
        low_stock_rewards: number;
    };
    recent_transactions: Transaction[];
    low_stock_items: RewardItem[];
}

export default function Dashboard({ stats, recent_transactions, low_stock_items }: DashboardProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);

        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header with Quick Shortcuts */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Operasional</h1>
                        <p className="text-sm text-muted-foreground mt-1">Pemantauan timbangan real-time dan pelacakan inventaris.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={admin.transactions.index().url}>
                            <Button className="gap-2">
                                <PlusCircle className="size-4" /> POS Setor Sampah
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Transaksi Hari Ini</span>
                            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                                <Scale className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-foreground">{stats.transactions_today}</span>
                            <span className="text-xs text-muted-foreground block mt-1">setoran tercatat hari ini</span>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Total Berat Hari Ini</span>
                            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                                <Scale className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-foreground">{stats.weight_today} kg</span>
                            <span className="text-xs text-muted-foreground block mt-1">massa sampah terkumpul</span>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Menunggu Persetujuan</span>
                            <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-500">
                                <CheckCircle className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-foreground">{stats.pending_redemptions}</span>
                            <span className="text-xs text-muted-foreground block mt-1">klaim menanti verifikasi</span>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Nasabah Aktif</span>
                            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
                                <Users className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-foreground">{stats.total_nasabah}</span>
                            <span className="text-xs text-muted-foreground block mt-1">warga terdaftar</span>
                        </div>
                    </div>
                </div>

                {/* Operations Section */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Recent Transactions List */}
                    <div className="md:col-span-2 rounded-xl border border-sidebar-border/70 bg-card p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-foreground">Setoran Sampah Terbaru</h3>
                                <Link href={admin.transactions.index().url} className="text-xs text-primary flex items-center gap-1 hover:underline">
                                    Lihat semua <ArrowRight className="size-3" />
                                </Link>
                            </div>
                            <div className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                                {recent_transactions.length > 0 ? (
                                    recent_transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-foreground">{tx.user.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {tx.total_weight} kg dari {tx.sampah.name}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-semibold text-emerald-500">
                                                    + {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(tx.total_income)}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground block">
                                                    hari ini pukul {formatDate(tx.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-sm text-muted-foreground">
                                        Belum ada setoran tercatat hari ini.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Low Stock Rewards / Alert Panel */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-foreground">Peringatan Inventaris</h3>
                                {stats.low_stock_rewards > 0 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                        {stats.low_stock_rewards} kritis
                                    </span>
                                )}
                            </div>

                            <div className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                                {low_stock_items.length > 0 ? (
                                    low_stock_items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 py-3">
                                            <AlertTriangle className="size-4 text-red-500 shrink-0" />
                                            <div className="flex-1 flex flex-col min-w-0">
                                                <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                                                <span className="text-xs text-red-500 font-semibold">
                                                    Sisa stok: {item.stock} unit
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 flex flex-col items-center gap-2">
                                        <Award className="size-8 text-muted-foreground opacity-40" />
                                        <span className="text-sm text-muted-foreground">Stok hadiah aman & optimal.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Link href={admin.rewards.index().url} className="mt-4 w-full">
                            <Button variant="outline" className="w-full text-xs">
                                Kelola Inventaris Hadiah
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

// Inline button component helper to avoid components created inside render
function Button({ children, className = '', variant = 'default', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' }) {
    const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 cursor-pointer";
    const variantStyle = variant === 'default'
        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
        : "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground";

    return (
        <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
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
