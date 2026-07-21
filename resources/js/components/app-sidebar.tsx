import { Link, usePage } from '@inertiajs/react';
import { Activity, Award, BookOpen, FolderGit2, Gift, LayoutGrid, Scale, Trash2, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import admin from '@/routes/admin';
import nasabah from '@/routes/nasabah';
import superAdmin from '@/routes/super_admin';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const role = auth.user?.role;

    const mainNavItems: NavItem[] = [];

    if (role === 'super_admin') {
        mainNavItems.push({
            title: 'Dashboard',
            href: superAdmin.dashboard().url,
            icon: LayoutGrid,
        });
        mainNavItems.push({
            title: 'Manajemen Pengguna',
            href: superAdmin.users.index().url,
            icon: Users,
        });
        mainNavItems.push({
            title: 'Log Audit Sistem',
            href: superAdmin.audit_logs.index().url,
            icon: Activity,
        });
    } else if (role === 'admin') {
        mainNavItems.push({
            title: 'Dashboard',
            href: admin.dashboard().url,
            icon: LayoutGrid,
        });
        mainNavItems.push({
            title: 'POS Setor Sampah',
            href: admin.transactions.index().url,
            icon: Scale,
        });
        mainNavItems.push({
            title: 'Persetujuan Hadiah',
            href: admin.redemptions.index().url,
            icon: Gift,
        });
        mainNavItems.push({
            title: 'Inventaris Sampah',
            href: admin.sampah.index().url,
            icon: Trash2,
        });
        mainNavItems.push({
            title: 'Inventaris Hadiah',
            href: admin.rewards.index().url,
            icon: Award,
        });
        mainNavItems.push({
            title: 'Direktori Warga',
            href: admin.nasabah.index().url,
            icon: Users,
        });
    } else if (role === 'nasabah') {
        mainNavItems.push({
            title: 'Dashboard Warga',
            href: nasabah.dashboard().url,
            icon: LayoutGrid,
        });
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Banksampah Repository',
            href: 'https://github.com/citah/Banksampah',
            icon: FolderGit2,
        },
        {
            title: 'Banksampah Documentation',
            href: 'https://github.com/citah/Banksampah/tree/main/docs',
            icon: BookOpen,
        },
    ];

    const dashboardUrl = role === 'super_admin'
        ? superAdmin.dashboard().url
        : (role === 'admin' ? admin.dashboard().url : (role === 'nasabah' ? nasabah.dashboard().url : '/dashboard'));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
