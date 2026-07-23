import { Calendar, Coins, Eye, MapPin, Phone, Printer, Receipt, Scale, User, UserCheck, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { User as UserType, Sampah } from '@/types';

export interface Transaction {
    id: number;
    user_id: number;
    admin_id: number;
    sampah_id: number;
    total_weight: number;
    total_income: number;
    type?: 'campur' | 'pilah';
    created_at: string;
    user?: UserType;
    admin?: UserType;
    sampah?: Sampah;
}

interface TransactionDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction | null;
}

export function TransactionDetailDialog({
    open,
    onOpenChange,
    transaction,
}: TransactionDetailDialogProps) {
    if (!transaction) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const pricePerKg =
        transaction.total_weight > 0
            ? Math.round(transaction.total_income / transaction.total_weight)
            : 0;

    // Process Jenis Sampah list (if multiple items comma separated)
    const sampahName = transaction.sampah?.name || 'Sampah';
    const sampahItems = sampahName
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '');

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-sidebar-border/70 pb-3 dark:border-sidebar-border">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                        <Receipt className="size-5 text-emerald-600 dark:text-emerald-400" />
                        Nota Detail Setoran Sampah
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Rincian lengkap transaksi POS setoran sampah warga.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-3 text-sm">
                    {/* Header ID & Tanggal */}
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-accent/40 p-3 text-xs border border-sidebar-border/50">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-muted-foreground">No. Transaksi:</span>
                            <span className="font-bold font-mono text-foreground">
                                #POS-{String(transaction.id).padStart(5, '0')}
                            </span>
                            {transaction.type === 'pilah' || (transaction.sampah?.name || '').includes('@ Rp') ? (
                                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                                    ♻️ Pilah
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                                    📦 Campur
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="size-3.5 text-emerald-600" />
                            <span>{formatDate(transaction.created_at)}</span>
                        </div>
                    </div>

                    {/* Information Grid: Warga & Petugas */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        {/* Data Nasabah */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-3.5 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 border-b border-sidebar-border/40 pb-1.5">
                                <User className="size-4" /> Data Nasabah (Warga)
                            </div>
                            <div className="space-y-1 text-xs">
                                <p className="font-bold text-foreground text-sm">
                                    {transaction.user?.name || `Warga ID: ${transaction.user_id}`}
                                </p>
                                {transaction.user?.phone_number && (
                                    <p className="flex items-center gap-1.5 text-muted-foreground">
                                        <Phone className="size-3 text-emerald-600" />
                                        {transaction.user.phone_number}
                                    </p>
                                )}
                                {transaction.user?.address && (
                                    <p className="flex items-start gap-1.5 text-muted-foreground">
                                        <MapPin className="size-3 shrink-0 text-emerald-600 mt-0.5" />
                                        <span>{transaction.user.address}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Data Petugas */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-3.5 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 border-b border-sidebar-border/40 pb-1.5">
                                <UserCheck className="size-4" /> Petugas Pencatat POS
                            </div>
                            <div className="space-y-1 text-xs">
                                <p className="font-bold text-foreground text-sm">
                                    {transaction.admin?.name || 'Petugas System'}
                                </p>
                                {transaction.admin?.email && (
                                    <p className="text-muted-foreground">
                                        {transaction.admin.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Rincian Sampah List */}
                    <div className="space-y-2.5 rounded-xl border border-sidebar-border/70 bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-bold text-foreground border-b border-sidebar-border/50 pb-2">
                            <span className="flex items-center gap-1.5">
                                <Tag className="size-4 text-emerald-600" /> Rincian Jenis Sampah
                            </span>
                            <span className="text-muted-foreground">
                                {sampahItems.length} Kategori
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {sampahItems.map((item, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                                >
                                    ♻️ {item}
                                </span>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-sidebar-border/50 text-xs">
                            <div>
                                <span className="text-muted-foreground">Berat Total Sampah:</span>
                                <p className="text-base font-bold text-foreground flex items-center gap-1 mt-0.5">
                                    <Scale className="size-4 text-emerald-600" />
                                    {transaction.total_weight} kg
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Harga Satuan Pengepul:</span>
                                <p className="text-base font-bold text-foreground flex items-center gap-1 mt-0.5">
                                    <Coins className="size-4 text-emerald-600" />
                                    {formatCurrency(pricePerKg)} /kg
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Ringkasan Pembayaran */}
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-900 dark:text-emerald-100 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                                Total Uang Diterima Warga
                            </span>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                Disetorkan oleh {transaction.admin?.name || 'Petugas'}
                            </p>
                        </div>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(transaction.total_income)}
                        </span>
                    </div>
                </div>

                <DialogFooter className="flex items-center justify-between sm:justify-between border-t border-sidebar-border/70 pt-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="gap-1.5 border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10"
                    >
                        <Printer className="size-4" /> Cetak Nota
                    </Button>
                    <Button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        size="sm"
                    >
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
