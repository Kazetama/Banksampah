import { Head, router } from '@inertiajs/react';
import { Check, Clock, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RedemptionStatusDialog } from '@/components/redemption-status-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import admin from '@/routes/admin';
import type { TukarPoin, PaginatedData } from '@/types';

interface IndexProps {
    redemptions: PaginatedData<TukarPoin>;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ redemptions, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedRedemption, setSelectedRedemption] = useState<TukarPoin | null>(null);
    const [statusToSet, setStatusToSet] = useState<'process' | 'done' | 'rejected' | null>(null);

    // Debounce search and filter updates
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '') || statusFilter !== (filters.status || 'all')) {
                router.get(
                    admin.redemptions.index().url,
                    { search, status: statusFilter },
                    { preserveState: true, replace: true }
                );
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search, statusFilter, filters.search, filters.status]);

    const handleActionClick = (redemption: TukarPoin, targetStatus: typeof statusToSet) => {
        setSelectedRedemption(redemption);
        setStatusToSet(targetStatus);
        setIsConfirmOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20">Menunggu</Badge>;
            case 'process':
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">Diproses</Badge>;
            case 'done':
                return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">Diterima</Badge>;
            default:
                return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Ditolak</Badge>;
        }
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
            <Head title="Persetujuan Klaim Hadiah" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Persetujuan Klaim Hadiah</h1>
                    <p className="text-sm text-muted-foreground mt-1">Meninjau, memproses, dan menyetujui klaim poin hadiah yang diajukan oleh warga.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari berdasarkan nama warga atau nama hadiah..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="process">Diproses</option>
                            <option value="done">Diterima</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                </div>

                {/* Datatable */}
                <div className="border border-sidebar-border/70 dark:border-sidebar-border rounded-lg overflow-x-auto bg-card">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-sidebar dark:bg-neutral-900 border-b border-sidebar-border/70 dark:border-sidebar-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Tanggal Pengajuan</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Nasabah (Warga)</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Hadiah yang Diminta</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Jumlah</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Biaya Poin</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                            {redemptions.data.length > 0 ? (
                                redemptions.data.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-accent/40 transition-colors">
                                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                            {formatDate(claim.created_at)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {claim.user ? claim.user.name : `Warga ID: ${claim.user_id}`}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {claim.reward ? claim.reward.name : 'Hadiah Tidak Dikenal'}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                            {claim.quantity}x
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">
                                            {claim.total_price} poin
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(claim.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {claim.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleActionClick(claim, 'process')}
                                                            className="gap-1 px-2.5 h-8 text-xs"
                                                        >
                                                            <Clock className="size-3.5" /> Proses
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleActionClick(claim, 'rejected')}
                                                            className="gap-1 px-2.5 h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/10"
                                                        >
                                                            <X className="size-3.5" /> Tolak
                                                        </Button>
                                                    </>
                                                )}
                                                {claim.status === 'process' && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleActionClick(claim, 'done')}
                                                            className="gap-1 px-2.5 h-8 text-xs text-green-600 hover:text-green-700 hover:bg-green-500/10 border-green-500/10"
                                                        >
                                                            <Check className="size-3.5" /> Setujui
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleActionClick(claim, 'rejected')}
                                                            className="gap-1 px-2.5 h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/10"
                                                        >
                                                            <X className="size-3.5" /> Tolak
                                                        </Button>
                                                    </>
                                                )}
                                                {inArray(claim.status, ['done', 'rejected']) && (
                                                    <span className="text-xs text-muted-foreground px-2">
                                                        Diproses oleh {claim.admin ? claim.admin.name : 'Sistem'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                        Klaim penukaran poin tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {redemptions.total > redemptions.per_page && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                        <div className="text-xs text-muted-foreground text-center sm:text-left">
                            Menampilkan {redemptions.from} hingga {redemptions.to} dari {redemptions.total} pengajuan
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                            {redemptions.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (link.url) {
                                            router.get(
                                                link.url,
                                                { search, status: statusFilter },
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

            {/* Confirmation Dialog */}
            <RedemptionStatusDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                redemption={selectedRedemption}
                statusToSet={statusToSet}
            />
        </>
    );
}

function inArray<T>(val: T, arr: T[]): boolean {
    return arr.indexOf(val) !== -1;
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Persetujuan Klaim Hadiah',
            href: admin.redemptions.index().url,
        },
    ],
};
