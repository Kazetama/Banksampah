import { Head, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CategoryFormDialog } from '@/components/category-form-dialog';
import { DeleteCategoryDialog } from '@/components/delete-category-dialog';
import { DeleteSampahDialog } from '@/components/delete-sampah-dialog';
import { SampahFormDialog } from '@/components/sampah-form-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import admin from '@/routes/admin';
import type { Sampah, SampahCategory, PaginatedData } from '@/types';

interface IndexProps {
    sampah: PaginatedData<Sampah>;
    categories: SampahCategory[];
    filters: {
        search?: string;
    };
}

export default function Index({ sampah, categories, filters }: IndexProps) {
    const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
    const [search, setSearch] = useState(filters.search || '');

    // Modal States
    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
    const [isCategoryDeleteOpen, setIsCategoryDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<SampahCategory | null>(null);

    const [isSampahFormOpen, setIsSampahFormOpen] = useState(false);
    const [isSampahDeleteOpen, setIsSampahDeleteOpen] = useState(false);
    const [selectedSampah, setSelectedSampah] = useState<Sampah | null>(null);

    // Debounce search update (only applies to waste items)
    useEffect(() => {
        if (activeTab === 'items') {
            const delayDebounceFn = setTimeout(() => {
                if (search !== (filters.search || '')) {
                    router.get(
                        admin.sampah.index().url,
                        { search },
                        { preserveState: true, replace: true }
                    );
                }
            }, 400);

            return () => clearTimeout(delayDebounceFn);
        }
    }, [search, activeTab, filters.search]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Category Action triggers
    const handleCreateCategory = () => {
        setSelectedCategory(null);
        setIsCategoryFormOpen(true);
    };

    const handleEditCategory = (cat: SampahCategory) => {
        setSelectedCategory(cat);
        setIsCategoryFormOpen(true);
    };

    const handleDeleteCategory = (cat: SampahCategory) => {
        setSelectedCategory(cat);
        setIsCategoryDeleteOpen(true);
    };

    // Sampah Item Action triggers
    const handleCreateSampah = () => {
        setSelectedSampah(null);
        setIsSampahFormOpen(true);
    };

    const handleEditSampah = (item: Sampah) => {
        setSelectedSampah(item);
        setIsSampahFormOpen(true);
    };

    const handleDeleteSampah = (item: Sampah) => {
        setSelectedSampah(item);
        setIsSampahDeleteOpen(true);
    };

    return (
        <>
            <Head title="Inventaris Sampah" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventaris Sampah</h1>
                        <p className="text-sm text-muted-foreground mt-1">Mengatur jenis sampah, harga per kg, dan pengelompokan kategori.</p>
                    </div>
                    <div>
                        {activeTab === 'items' ? (
                            <Button onClick={handleCreateSampah} className="gap-2">
                                <Plus className="size-4" /> Tambah Jenis Sampah
                            </Button>
                        ) : (
                            <Button onClick={handleCreateCategory} className="gap-2">
                                <Plus className="size-4" /> Tambah Kategori
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabs Selector */}
                <div className="flex border-b border-sidebar-border/50 dark:border-sidebar-border/30">
                    <button
                        onClick={() => setActiveTab('items')}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                            activeTab === 'items'
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Jenis Sampah
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                            activeTab === 'categories'
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Kategori Sampah
                    </button>
                </div>

                {/* Tab content: Waste Items */}
                {activeTab === 'items' && (
                    <div className="flex flex-col gap-4">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari jenis sampah..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Items Datatable */}
                        <div className="border border-sidebar-border/70 dark:border-sidebar-border rounded-lg overflow-x-auto bg-card">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-sidebar dark:bg-neutral-900 border-b border-sidebar-border/70 dark:border-sidebar-border">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-muted-foreground">Jenis Sampah</th>
                                        <th className="px-6 py-4 font-semibold text-muted-foreground">Kategori</th>
                                        <th className="px-6 py-4 font-semibold text-muted-foreground">Harga per Kg</th>
                                        <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                                    {sampah.data.length > 0 ? (
                                        sampah.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-accent/40 transition-colors">
                                                <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {item.category ? item.category.name : '-'}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-emerald-500">
                                                    {formatCurrency(item.price_per_kg)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleEditSampah(item)}
                                                            className="size-8"
                                                        >
                                                            <Edit className="size-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleDeleteSampah(item)}
                                                            className="size-8 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/10"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                                Jenis sampah tidak ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Items Pagination */}
                        {sampah.total > sampah.per_page && (
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                                <div className="text-xs text-muted-foreground text-center sm:text-left">
                                    Menampilkan {sampah.from} hingga {sampah.to} dari {sampah.total} jenis sampah
                                </div>
                                <div className="flex flex-wrap justify-center gap-1">
                                    {sampah.links.map((link, idx) => (
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
                )}

                {/* Tab content: Waste Categories */}
                {activeTab === 'categories' && (
                    <div className="border border-sidebar-border/70 dark:border-sidebar-border rounded-lg overflow-x-auto bg-card">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-sidebar dark:bg-neutral-900 border-b border-sidebar-border/70 dark:border-sidebar-border">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground">Nama Kategori</th>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground">Deskripsi</th>
                                    <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-accent/40 transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground">{cat.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground max-w-sm whitespace-normal">
                                                {cat.description || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleEditCategory(cat)}
                                                        className="size-8"
                                                    >
                                                        <Edit className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDeleteCategory(cat)}
                                                        className="size-8 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/10"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                                            Kategori belum dikonfigurasi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Category Dialog Modals */}
            <CategoryFormDialog open={isCategoryFormOpen} onOpenChange={setIsCategoryFormOpen} category={selectedCategory} />
            <DeleteCategoryDialog open={isCategoryDeleteOpen} onOpenChange={setIsCategoryDeleteOpen} category={selectedCategory} />

            {/* Sampah Item Dialog Modals */}
            <SampahFormDialog open={isSampahFormOpen} onOpenChange={setIsSampahFormOpen} sampah={selectedSampah} categories={categories} />
            <DeleteSampahDialog open={isSampahDeleteOpen} onOpenChange={setIsSampahDeleteOpen} sampah={selectedSampah} />
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Inventaris Sampah',
            href: admin.sampah.index().url,
        },
    ],
};
