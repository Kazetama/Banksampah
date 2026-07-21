import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid } from 'lucide-react';
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
            title: 'Super Admin Dashboard',
            href: superAdmin.dashboard().url,
            icon: LayoutGrid,
        });
    } else if (role === 'admin') {
        mainNavItems.push({
            title: 'Admin Dashboard',
            href: admin.dashboard().url,
            icon: LayoutGrid,
        });
    } else if (role === 'nasabah') {
        mainNavItems.push({
            title: 'Nasabah Dashboard',
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
