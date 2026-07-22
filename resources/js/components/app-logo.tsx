import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-white border border-emerald-200/80 p-1 shadow-xs">
                <img
                    src="/kkn aktivis (5)(1).png"
                    alt="Logo KKN Aktivis"
                    className="size-7 object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-black text-sidebar-foreground">
                    {name ?? 'SIBANDO'}
                </span>
                <span className="truncate text-[10px] font-bold text-emerald-600">
                    KKN Aktivis Doko
                </span>
            </div>
        </>
    );
}


