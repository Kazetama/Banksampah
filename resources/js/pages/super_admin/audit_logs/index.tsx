import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import superAdmin from '@/routes/super_admin';
import type { AuditLog, PaginatedData } from '@/types';

interface IndexProps {
    logs: PaginatedData<AuditLog>;
    filters: {
        search?: string;
    };
}

export default function Index({ logs, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    // Debounce search updates
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    superAdmin.audit_logs.index().url,
                    { search },
                    { preserveState: true, replace: true },
                );
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search, filters.search]);

    const formatAction = (action: string) => {
        return action
            .replace(/_/g, ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
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
            <Head title="Log Audit Sistem" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Log Audit Sistem
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Memantau semua tindakan administratif dan aktivitas
                        keamanan sistem.
                    </p>
                </div>

                {/* Filters */}
                <div className="relative">
                    <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari log berdasarkan aktor, aksi, atau deskripsi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Datatable */}
                <div className="min-h-[400px] flex-1 overflow-x-auto rounded-lg border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-sidebar-border/70 bg-sidebar text-xs uppercase dark:border-sidebar-border dark:bg-neutral-900">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Waktu
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Aktor
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Aksi
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Alamat IP
                                </th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">
                                    Deskripsi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                            {logs.data.length > 0 ? (
                                logs.data.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="transition-colors hover:bg-accent/40"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                            {formatDate(log.created_at)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {log.user
                                                ? log.user.name
                                                : `Pengguna Sistem (ID: ${log.user_id})`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-md border border-sidebar-border/70 bg-sidebar px-2 py-0.5 text-xs font-semibold text-foreground dark:border-sidebar-border">
                                                {formatAction(log.action)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                            {log.ip_address || '-'}
                                        </td>
                                        <td className="max-w-sm px-6 py-4 break-words whitespace-normal text-muted-foreground">
                                            {log.description}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-muted-foreground"
                                    >
                                        Log audit tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.total > logs.per_page && (
                    <div className="flex flex-col gap-4 border-t border-sidebar-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                        <div className="text-center text-xs text-muted-foreground sm:text-left">
                            Menampilkan {logs.from} hingga {logs.to} dari{' '}
                            {logs.total} entri log
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                            {logs.links.map((link, idx) => (
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
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Log Audit Sistem',
            href: '#',
        },
    ],
};
