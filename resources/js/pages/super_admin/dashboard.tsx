import { Head } from '@inertiajs/react';
import { DollarSign, Shield, Trash2, Users } from 'lucide-react';
import superAdmin from '@/routes/super_admin';

interface StatItem {
    total_nasabah: number;
    total_weight: number;
    total_cash_out: number;
    total_admin: number;
}

interface ChartNode {
    name: string;
    [key: string]: number | string;
}

interface DashboardProps {
    stats: StatItem;
    charts: {
        weight_trend: ChartNode[];
        cashflow: ChartNode[];
        user_growth: ChartNode[];
        category_distribution: { name: string; value: number }[];
    };
}

// Formatting Helpers
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
};

// 1. Custom SVG Line Chart Component (for Trends)
const SVGLineChart = ({
    data,
    dataKey,
    color,
}: {
    data: ChartNode[];
    dataKey: string;
    color: string;
}) => {
    const height = 150;
    const width = 500;
    const padding = 20;

    const values = data.map((d) => d[dataKey] as number);
    const maxVal = Math.max(...values, 10);
    const minVal = 0;
    const range = maxVal - minVal;

    const points = data.map((d, index) => {
        const x = padding + (index / (data.length - 1)) * (width - padding * 2);
        const val = d[dataKey] as number;
        const y =
            height -
            padding -
            ((val - minVal) / range) * (height - padding * 2);

        return { x, y, val, label: d.name };
    });

    // Generate SVG Path
    const pathD = points.reduce((acc, p, i) => {
        return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    // Area path for gradient fill
    const areaD =
        points.length > 0
            ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
            : '';

    return (
        <div className="relative w-full">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full overflow-visible"
            >
                <defs>
                    <linearGradient
                        id={`grad-${dataKey}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor={color}
                            stopOpacity="0.25"
                        />
                        <stop
                            offset="100%"
                            stopColor={color}
                            stopOpacity="0.0"
                        />
                    </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                {[0, 0.5, 1].map((ratio, idx) => {
                    const y = padding + ratio * (height - padding * 2);
                    const val = Math.round(maxVal - ratio * range);

                    return (
                        <g key={idx} className="opacity-20 dark:opacity-10">
                            <line
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="currentColor"
                                strokeDasharray="3,3"
                            />
                            <text
                                x={padding - 5}
                                y={y + 4}
                                textAnchor="end"
                                className="fill-current text-[9px]"
                            >
                                {formatNumber(val)}
                            </text>
                        </g>
                    );
                })}

                {/* Area under the line */}
                {areaD && <path d={areaD} fill={`url(#grad-${dataKey})`} />}

                {/* Line Path */}
                {pathD && (
                    <path
                        d={pathD}
                        fill="none"
                        stroke={color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300"
                    />
                )}

                {/* Data Points / Circular Handles */}
                {points.map((p, idx) => (
                    <g key={idx} className="group/dot cursor-pointer">
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="4"
                            fill={color}
                            className="stroke-background stroke-2 transition-transform duration-200 group-hover/dot:scale-150"
                        />
                        <text
                            x={p.x}
                            y={p.y - 10}
                            textAnchor="middle"
                            className="rounded border bg-background fill-foreground p-1 text-[8px] font-semibold opacity-0 shadow-sm transition-opacity group-hover/dot:opacity-100"
                        >
                            {formatNumber(p.val)}
                        </text>
                    </g>
                ))}

                {/* Month Labels on X Axis */}
                {points.map((p, idx) => (
                    <text
                        key={idx}
                        x={p.x}
                        y={height - 4}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[9px] font-medium"
                    >
                        {p.label}
                    </text>
                ))}
            </svg>
        </div>
    );
};

// 2. Custom SVG Bar Chart Component (for Cashflow)
const SVGBarChart = ({
    data,
    dataKey,
    color,
}: {
    data: ChartNode[];
    dataKey: string;
    color: string;
}) => {
    const height = 150;
    const width = 500;
    const padding = 20;

    const values = data.map((d) => d[dataKey] as number);
    const maxVal = Math.max(...values, 100000);
    const minVal = 0;
    const range = maxVal - minVal;

    const chartWidth = width - padding * 2;
    const barWidth = (chartWidth / data.length) * 0.6;
    const gap = (chartWidth / data.length) * 0.4;

    return (
        <div className="relative w-full">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full overflow-visible"
            >
                {/* Horizontal Gridlines */}
                {[0, 0.5, 1].map((ratio, idx) => {
                    const y = padding + ratio * (height - padding * 2);
                    const val = Math.round(maxVal - ratio * range);

                    return (
                        <g key={idx} className="opacity-20 dark:opacity-10">
                            <line
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="currentColor"
                                strokeDasharray="3,3"
                            />
                            <text
                                x={padding - 5}
                                y={y + 4}
                                textAnchor="end"
                                className="fill-current text-[9px]"
                            >
                                {val >= 1000 ? `${val / 1000}k` : val}
                            </text>
                        </g>
                    );
                })}

                {/* Bars */}
                {data.map((d, index) => {
                    const val = d[dataKey] as number;
                    const barHeight =
                        ((val - minVal) / range) * (height - padding * 2);
                    const x = padding + index * (barWidth + gap) + gap / 2;
                    const y = height - padding - barHeight;

                    return (
                        <g key={index} className="group/bar cursor-pointer">
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={Math.max(barHeight, 2)}
                                fill={color}
                                rx="3"
                                className="opacity-80 transition-all duration-200 hover:opacity-100"
                            />
                            <text
                                x={x + barWidth / 2}
                                y={y - 8}
                                textAnchor="middle"
                                className="fill-foreground text-[8px] font-semibold opacity-0 transition-opacity group-hover/bar:opacity-100"
                            >
                                {val >= 1000
                                    ? `${(val / 1000).toFixed(1)}k`
                                    : val}
                            </text>
                            <text
                                x={x + barWidth / 2}
                                y={height - 4}
                                textAnchor="middle"
                                className="fill-muted-foreground text-[9px] font-medium"
                            >
                                {d.name}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// 3. Custom SVG Donut / Category Chart
const SVGDonutChart = ({
    data,
}: {
    data: { name: string; value: number }[];
}) => {
    const size = 180;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    const total = data.reduce((acc, d) => acc + d.value, 0);

    // Predefined beautiful colors
    const colors = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6'];

    let accumulatedAngle = 0;

    return (
        <div className="flex w-full flex-col items-center justify-around gap-6 py-2 sm:flex-row">
            <div className="relative flex h-44 w-44 items-center justify-center">
                <svg
                    width={size}
                    height={size}
                    className="-rotate-90 transform"
                >
                    {total === 0 ? (
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke="#E5E7EB"
                            strokeWidth={strokeWidth}
                        />
                    ) : (
                        data.map((d, idx) => {
                            const percentage = d.value / total;
                            const strokeDashoffset =
                                circumference - percentage * circumference;
                            const rotation = (accumulatedAngle / total) * 360;
                            accumulatedAngle += d.value;

                            return (
                                <circle
                                    key={idx}
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    fill="transparent"
                                    stroke={colors[idx % colors.length]}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    transform={`rotate(${rotation} ${center} ${center})`}
                                    className="cursor-pointer transition-all duration-500 hover:stroke-[28px]"
                                />
                            );
                        })
                    )}
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold text-foreground">
                        {formatNumber(total)}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Total Kg
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {data.map((d, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                        <span
                            className="size-3 shrink-0 rounded-xs"
                            style={{
                                backgroundColor: colors[idx % colors.length],
                            }}
                        />
                        <span className="font-medium text-foreground">
                            {d.name}
                        </span>
                        <span className="text-muted-foreground">
                            (
                            {total > 0
                                ? ((d.value / total) * 100).toFixed(1)
                                : 0}
                            %)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Dashboard({ stats, charts }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard Super Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Dashboard Analitik Global
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Indikator waktu nyata, arus volume sampah, dan
                        pendaftaran warga.
                    </p>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Nasabah */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                Total Nasabah
                            </span>
                            <div className="rounded-lg bg-green-500/10 p-2 text-green-500">
                                <Users className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-foreground">
                                {formatNumber(stats.total_nasabah)}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                                Warga terdaftar sebagai nasabah
                            </span>
                        </div>
                    </div>

                    {/* Card 2: Waste Weight */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                Sampah Terkumpul
                            </span>
                            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                                <Trash2 className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-foreground">
                                {formatNumber(stats.total_weight)} kg
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                                Total akumulasi berat timbunan
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Cashflow Out */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                Arus Kas Keluar
                            </span>
                            <div className="rounded-lg bg-red-500/10 p-2 text-red-500">
                                <DollarSign className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-foreground">
                                {formatCurrency(stats.total_cash_out)}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                                Kas dibayarkan kepada warga
                            </span>
                        </div>
                    </div>

                    {/* Card 4: Total Admin / Petugas POS */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                Petugas / Admin RT
                            </span>
                            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                                <Users className="size-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-foreground">
                                {formatNumber(stats.total_admin)} Petugas
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                                Admin pengelola pos penimbangan
                            </span>
                        </div>
                    </div>
                </div>

                {/* Analytical Charts Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Chart 1: Weight Trend */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5">
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            Tren Penyetoran Sampah (6 Bulan Terakhir)
                        </h3>
                        <SVGLineChart
                            data={charts.weight_trend}
                            dataKey="weight"
                            color="#3B82F6"
                        />
                        <div className="mt-2 text-center text-[10px] font-medium text-muted-foreground">
                            Volume Sampah (kg)
                        </div>
                    </div>

                    {/* Chart 2: Cashflow Trend */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5">
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            Kas Keluar Penimbangan (6 Bulan Terakhir)
                        </h3>
                        <SVGBarChart
                            data={charts.cashflow}
                            dataKey="amount"
                            color="#EF4444"
                        />
                        <div className="mt-2 text-center text-[10px] font-medium text-muted-foreground">
                            Pembayaran Timbangan (Rp)
                        </div>
                    </div>

                    {/* Chart 3: User Growth */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5">
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            Akumulasi Pertumbuhan Nasabah
                        </h3>
                        <SVGLineChart
                            data={charts.user_growth}
                            dataKey="users"
                            color="#10B981"
                        />
                        <div className="mt-2 text-center text-[10px] font-medium text-muted-foreground">
                            Total Anggota Terdaftar
                        </div>
                    </div>

                    {/* Chart 4: Category Distribution */}
                    <div className="flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-card p-5">
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            Komposisi Jenis Sampah Terkumpul
                        </h3>
                        <div className="flex flex-1 items-center justify-center">
                            <SVGDonutChart
                                data={charts.category_distribution}
                            />
                        </div>
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
            href: superAdmin.dashboard().url,
        },
    ],
};
