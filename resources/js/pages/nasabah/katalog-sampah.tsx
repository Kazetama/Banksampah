import { Head } from '@inertiajs/react';
import { Calculator, Layers } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import nasabah from '@/routes/nasabah';
import type { Sampah, SampahCategory } from '@/types';

interface KatalogProps {
    categories: SampahCategory[];
    sampahItems: Sampah[];
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

export default function KatalogSampah({ categories, sampahItems }: KatalogProps) {
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [calcSampahId, setCalcSampahId] = useState<number>(sampahItems[0]?.id ?? 0);
    const [calcWeight, setCalcWeight] = useState<string>('');

    const filteredItems = activeCategory
        ? sampahItems.filter((s) => s.category_id === activeCategory)
        : sampahItems;

    const selectedSampah = sampahItems.find((s) => s.id === calcSampahId);
    const weightNum = parseFloat(calcWeight) || 0;
    const estimatedIncome = selectedSampah ? Math.floor(weightNum * selectedSampah.price_per_kg) : 0;
    const estimatedPoints = Math.floor(estimatedIncome / 1000);

    return (
        <>
            <Head title="Katalog Sampah" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Katalog Sampah</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Lihat jenis sampah yang diterima dan harga per kilogramnya.
                    </p>
                </div>

                {/* Kalkulator Estimasi */}
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Calculator className="size-5 text-blue-500" />
                        <h2 className="font-semibold text-foreground">Kalkulator Estimasi</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Pilih Jenis Sampah</label>
                            <select
                                value={calcSampahId}
                                onChange={(e) => setCalcSampahId(Number(e.target.value))}
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {sampahItems.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Perkiraan Berat (kg)</label>
                            <Input
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="Contoh: 5.5"
                                value={calcWeight}
                                onChange={(e) => setCalcWeight(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Estimasi Hasil</label>
                            <div className="flex h-9 items-center gap-3 rounded-md border border-input bg-background px-3 text-sm">
                                <span className="font-semibold text-emerald-500">{formatCurrency(estimatedIncome)}</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="font-bold text-amber-500">{estimatedPoints} poin</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Kategori */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors border ${
                            activeCategory === null
                                ? 'bg-primary text-primary-foreground border-transparent'
                                : 'bg-background text-foreground border-sidebar-border/70 hover:bg-accent dark:border-sidebar-border'
                        }`}
                    >
                        <Layers className="size-3" /> Semua Kategori
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors border ${
                                activeCategory === cat.id
                                    ? 'bg-primary text-primary-foreground border-transparent'
                                    : 'bg-background text-foreground border-sidebar-border/70 hover:bg-accent dark:border-sidebar-border'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Grid Sampah */}
                {filteredItems.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
                            >
                                <div className="rounded-lg bg-muted h-32 flex items-center justify-center overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={`/storage/${item.image}`}
                                            alt={item.name}
                                            className="h-full w-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <span className="text-4xl">♻️</span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground text-sm">{item.name}</p>
                                    {item.category && (
                                        <p className="text-xs text-muted-foreground mt-0.5">{item.category.name}</p>
                                    )}
                                </div>
                                <div className="mt-auto pt-2 border-t border-sidebar-border/40">
                                    <p className="text-xs text-muted-foreground">Harga per kg</p>
                                    <p className="text-base font-bold text-emerald-500">{formatCurrency(item.price_per_kg)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
                        Tidak ada jenis sampah dalam kategori ini.
                    </div>
                )}
            </div>
        </>
    );
}

KatalogSampah.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: nasabah.dashboard().url },
        { title: 'Katalog Sampah', href: nasabah.katalogSampah.index().url },
    ],
};
