import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import BottomNav from '@/components/bottom-nav';
import type { BreadcrumbItem } from '@/types';

type Props = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};


export default function AppSidebarLayout({ children, breadcrumbs = [] } : Props) {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const isOperator = user?.role === 'operator';

    return (
        <AppShell variant="sidebar">
            {/* ✅ Sidebar selalu ada */}
            <AppSidebar />

            <AppContent
                variant="sidebar"
                className="overflow-x-hidden pb-20 md:pb-0"
            >
                <AppSidebarHeader breadcrumbs={breadcrumbs} />

                {children}

                {/* ✅ Bottom nav hanya operator + mobile */}
                {isOperator && <BottomNav />}
            </AppContent>
        </AppShell>
    );
}