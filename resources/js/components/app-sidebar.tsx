import { Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import {
    Users,
    LayoutGrid,
    Boxes,
    Droplet,
    SquareChartGantt,
    History,
    TrafficCone,
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
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

import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth, session, currentProject } = usePage().props as any;
    const user = auth.user;
    const isAdmin = user?.role === 'admin';
    const selectedProjectId = session?.selected_project_id;

    /*
    |--------------------------------------------------------------------------
    | ADMIN BELUM PILIH PROJECT
    |--------------------------------------------------------------------------
    */

    if (isAdmin && !selectedProjectId) {
        const projectNavItems: NavItem[] = [
            {
                title: 'Project IPAL',
                href: '/projects',
                icon: TrafficCone,
            },
        ];

        return (
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/projects">
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <NavMain items={projectNavItems} />
                </SidebarContent>

                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | ADMIN SUDAH PILIH PROJECT
    |--------------------------------------------------------------------------
    */

    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Laporan Operasional',
            href: '/operational-reports',
            icon: SquareChartGantt,
        },
        {
            title: 'Operator IPAL',
            href: '/users',
            icon: Users,
        },
        {
            title: 'Unit IPAL',
            href: '/units',
            icon: Boxes,
        },
        {
            title: 'Parameter Air',
            href: '/water-parameters',
            icon: Droplet,
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | OPERATOR
    |--------------------------------------------------------------------------
    */

    const operatorNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Input Data Operasional',
            href: '/operational-reports/create',
            icon: SquareChartGantt,
        },
        {
            title: 'Riwayat',
            href: '/operational-reports/history',
            icon: History,
        },
    ];

    const mainNavItems = isAdmin ? adminNavItems : operatorNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                        <div className="px-2 pb-2">
                            <p className="truncate text-sm font-semibold">
                                {currentProject?.name}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                                {currentProject?.location} •{' '}
                                {currentProject?.type}
                            </p>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {isAdmin && (
                    <button
                        onClick={() => {
                            router.post('/projects/leave');
                        }}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent"
                    >
                        <TrafficCone size={18} />
                        <span>Project IPAL</span>
                    </button>
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
