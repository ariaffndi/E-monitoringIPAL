import { Link } from '@inertiajs/react';
import { Fragment } from 'react';

import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

type Props = {
    breadcrumbs: BreadcrumbItemType[];
};

export function Breadcrumbs({ breadcrumbs }: Props) {
    if (!breadcrumbs.length) {
        return null;
    }

    const shouldCollapse = breadcrumbs.length > 4;

    const first = breadcrumbs[0];

    const middle = breadcrumbs.slice(1, -2);

    const visible = shouldCollapse
        ? breadcrumbs.slice(-2)
        : breadcrumbs.slice(1);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* FIRST */}
                <BreadcrumbItem>
                    {first.href ? (
                        <BreadcrumbLink asChild>
                            <Link href={first.href}>{first.title}</Link>
                        </BreadcrumbLink>
                    ) : (
                        <BreadcrumbPage>{first.title}</BreadcrumbPage>
                    )}
                </BreadcrumbItem>

                {/* COLLAPSE */}
                {shouldCollapse && (
                    <>
                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                    >
                                        <BreadcrumbEllipsis />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="start">
                                    {middle.map((item, index) => (
                                        <DropdownMenuItem key={index} asChild>
                                            <Link href={item.href || '#'}>
                                                {item.title}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                    </>
                )}

                {/* VISIBLE ITEMS */}
                {visible.map((item, index) => {
                    const isLast = index === visible.length - 1;

                    return (
                        <Fragment key={index}>
                            <BreadcrumbSeparator />

                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="font-medium">
                                        {item.title}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={item.href || '#'}>
                                            {item.title}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
