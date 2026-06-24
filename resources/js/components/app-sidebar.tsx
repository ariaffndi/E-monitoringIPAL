import { Link, usePage } from '@inertiajs/react';
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
import { ProjectSelector } from '@/components/project/project-selector';
import { Separator } from '@/components/ui/separator';
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
    const { auth } = usePage().props as any;
    const user = auth.user;
    const isAdmin = user?.role === 'admin';
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

    const navItems = isAdmin ? adminNavItems : operatorNavItems;

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
                    </SidebarMenuItem>
                </SidebarMenu>

                {isAdmin && (
                    <div className="px-2 pb-2">
                        <ProjectSelector />
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                {isAdmin && (
                    <>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/projects">
                                        <TrafficCone />
                                        <span>Project IPAL</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>

                        <Separator />
                    </>
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
