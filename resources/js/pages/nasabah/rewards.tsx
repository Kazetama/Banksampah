import { Head, usePage } from '@inertiajs/react';
import { Gift, Package } from 'lucide-react';
import { useState } from 'react';
import { ClaimRewardDialog } from '@/components/claim-reward-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import nasabah from '@/routes/nasabah';
import type { Reward } from '@/types';

interface RewardsProps {
    rewards: Reward[];
    totalPoints: number;
}

interface FlashProps {
    success?: string;
    error?: string;
}

export default function Rewards({ rewards, totalPoints }: RewardsProps) {
    const { flash } = usePage<{ flash: FlashProps }>().props;
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [isClaimOpen, setIsClaimOpen] = useState(false);

    const handleClaim = (reward: Reward) => {
        setSelectedReward(reward);
        setIsClaimOpen(true);
    };

    return (
        <>
            <Head title="Katalog Hadiah" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-sidebar-border/70 pb-4 dark:border-sidebar-border">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Katalog Hadiah</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Tukarkan poin tabungan Anda dengan hadiah menarik.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 shrink-0">
                        <Gift className="size-4 text-amber-500" />
                        <span className="text-sm font-bold text-amber-500">
                            {totalPoints.toLocaleString('id-ID')} poin
                        </span>
                    </div>
                </div>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                        ✅ {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                        ❌ {flash.error}
                    </div>
                )}

                {/* Reward Grid */}
                {rewards.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {rewards.map((reward) => {
                            const canAfford = totalPoints >= reward.price;

                            return (
                                <div
                                    key={reward.id}
                                    className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card flex flex-col overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                                >
                                    {/* Image */}
                                    <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
                                        {reward.image ? (
                                            <img
                                                src={`/storage/${reward.image}`}
                                                alt={reward.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <Package className="size-14 text-muted-foreground/40" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col gap-2 p-4 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="font-semibold text-foreground text-sm leading-tight">{reward.name}</p>
                                            <Badge variant="outline" className="text-xs shrink-0">
                                                {reward.category}
                                            </Badge>
                                        </div>
                                        {reward.description && (
                                            <p className="text-xs text-muted-foreground line-clamp-2">{reward.description}</p>
                                        )}

                                        <div className="mt-auto pt-3 border-t border-sidebar-border/40 flex items-center justify-between gap-2">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Harga</p>
                                                <p className="font-bold text-amber-500 text-sm">
                                                    {reward.price.toLocaleString('id-ID')} poin
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant={canAfford ? 'default' : 'outline'}
                                                disabled={!canAfford || reward.stock === 0}
                                                onClick={() => handleClaim(reward)}
                                                className="text-xs"
                                            >
                                                {reward.stock === 0 ? 'Habis' : canAfford ? 'Klaim' : 'Poin Kurang'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                        <Gift className="size-12 opacity-30" />
                        <p className="text-sm">Belum ada hadiah yang tersedia saat ini.</p>
                    </div>
                )}
            </div>

            <ClaimRewardDialog
                open={isClaimOpen}
                onOpenChange={setIsClaimOpen}
                reward={selectedReward}
                totalPoints={totalPoints}
            />
        </>
    );
}

Rewards.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: nasabah.dashboard().url },
        { title: 'Katalog Hadiah', href: nasabah.rewards.index().url },
    ],
};
