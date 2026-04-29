import { usePage } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';


export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props as any;
    const isOperator = auth?.user?.role === 'operator';
    
    return (
        <header className="flex h-16 items-center gap-2 border-b px-6 md:px-4">
            <SidebarTrigger
                className={`${isOperator ? 'hidden md:inline-flex' : 'inline-flex'}`}
            />

            <Breadcrumbs breadcrumbs={breadcrumbs} />
        </header>
    );
}
