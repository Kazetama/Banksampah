import { Head, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DeleteRewardDialog } from '@/components/delete-reward-dialog';
import { RewardFormDialog } from '@/components/reward-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import admin from '@/routes/admin';
import type { Reward, PaginatedData } from '@/types';

interface IndexProps {
    rewards: PaginatedData<Reward>;
    filters: {
        search?: string;
    };
}

export default function Index({ rewards, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    admin.rewards.index().url,
                    { search },
                    { preserveState: true, replace: true }
                );
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search, filters.search]);

    const handleCreateClick = () => {
        setSelectedReward(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (reward: Reward) => {
        setSelectedReward(reward);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (reward: Reward) => {
        setSelectedReward(reward);
        setIsDeleteOpen(true);
    };

    const getStockBadge = (stock: number) => {
        if (stock === 0) {
            return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Stok Habis</Badge>;
        } else if (stock <= 5) {
            return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20">Stok Menipis ({stock})</Badge>;
        } else {
            return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">Tersedia ({stock})</Badge>;
        }
    };

    return (
        <>
            <Head title="Inventaris Hadiah" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventaris Hadiah</h1>
                        <p className="text-sm text-muted-foreground mt-1">Mengelola nilai poin dan stok barang hadiah (merchandise) yang dapat diklaim warga.</p>
                    </div>
                    <Button onClick={handleCreateClick} className="gap-2">
                        <Plus className="size-4" /> Tambah Barang Hadiah
                    </Button>
                </div>

                {/* Filters */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari hadiah berdasarkan nama atau kategori..."
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
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Hadiah</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Kategori</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Biaya Poin</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Status Stok</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                            {rewards.data.length > 0 ? (
                                rewards.data.map((reward) => (
                                    <tr key={reward.id} className="hover:bg-accent/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{reward.name}</span>
                                                <span className="text-xs text-muted-foreground max-w-xs truncate">
                                                    {reward.description || 'Tidak ada deskripsi.'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{reward.category}</td>
                                        <td className="px-6 py-4 font-semibold text-foreground">
                                            {reward.price} poin
                                        </td>
                                        <td className="px-6 py-4">{getStockBadge(reward.stock)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleEditClick(reward)}
                                                    className="size-8"
                                                >
                                                    <Edit className="size-3.5" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(reward)}
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
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        Barang hadiah tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {rewards.total > rewards.per_page && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                        <div className="text-xs text-muted-foreground text-center sm:text-left">
                            Menampilkan {rewards.from} hingga {rewards.to} dari {rewards.total} barang
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                            {rewards.links.map((link, idx) => (
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

            {/* Modals */}
            <RewardFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} reward={selectedReward} />
            <DeleteRewardDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} reward={selectedReward} />
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Inventaris Hadiah',
            href: admin.rewards.index().url,
        },
    ],
};
