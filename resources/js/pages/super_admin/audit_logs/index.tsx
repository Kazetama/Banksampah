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
                    { preserveState: true, replace: true }
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
            <Head title="System Audit Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">System Audit Logs</h1>
                    <p className="text-sm text-muted-foreground mt-1">Monitor all administrative actions and security activities.</p>
                </div>

                {/* Filters */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search logs by actor, action, or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Datatable */}
                <div className="flex-1 min-h-[400px] border border-sidebar-border/70 dark:border-sidebar-border rounded-lg overflow-x-auto bg-card">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-sidebar dark:bg-neutral-900 border-b border-sidebar-border/70 dark:border-sidebar-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Timestamp</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Actor</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Action</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">IP Address</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border/30">
                            {logs.data.length > 0 ? (
                                logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-accent/40 transition-colors">
                                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                            {formatDate(log.created_at)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {log.user ? log.user.name : `System User (ID: ${log.user_id})`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-sidebar border border-sidebar-border/70 dark:border-sidebar-border text-foreground">
                                                {formatAction(log.action)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-xs font-mono">
                                            {log.ip_address || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground max-w-sm whitespace-normal break-words">
                                            {log.description}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No audit logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.total > logs.per_page && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                        <div className="text-xs text-muted-foreground text-center sm:text-left">
                            Showing {logs.from} to {logs.to} of {logs.total} log entries
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
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'System Audit Logs',
            href: '#',
        },
    ],
};
