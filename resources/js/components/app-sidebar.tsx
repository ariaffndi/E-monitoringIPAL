import { Link, usePage } from '@inertiajs/react';
import { Users, FolderGit2, LayoutGrid, Boxes, Droplet } from 'lucide-react';
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
                title: 'Pengguna',
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
                href: '/waterparameters',
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
                title: 'Menu Operator 1',
                href: '/input',
                icon: Users,
            },
            {
                title: 'Menu Operator 2',
                href: '/history',
                icon: FolderGit2,
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
