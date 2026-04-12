import { Link, usePage } from '@inertiajs/react';
import { Users, LayoutGrid, Boxes, Droplet, SquareChartGantt, History } from 'lucide-react';
import AppLogo from '@/components/app-logo';
// import { NavFooter } from '@/components/nav-footer';
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
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

// const mainNavItems: NavItem[] = [
//     {
//         title: 'Dashboard',
//         href: dashboard(),
//         icon: LayoutGrid,
//     },
// ];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: FolderGit2,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const isAdmin = user?.role === 'admin';
    const dashboardHref = isAdmin ? '/admin' : '/operator';

    const mainNavItems: NavItem[] = isAdmin
        ? [
            {
                title: 'Dashboard',
                href: dashboardHref,
                icon: LayoutGrid,
            },
            {
                title: 'Laporan Operasional',
                href: '/',
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
        ]
        : [
            {
                title: 'Dashboard',
                href: dashboardHref,
                icon: LayoutGrid,
            },
            {
                title: 'Riwayat',
                href: '/history',
                icon: History,
            },
        ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
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
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
