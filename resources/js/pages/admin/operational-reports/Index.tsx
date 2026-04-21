import { Head, router } from '@inertiajs/react';
import { ListChecks, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

export default function OperationalReports({ reports, filters }: any){
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    // 🔍 SEARCH
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        const delay = setTimeout(() => {
            router.get('/operational-reports', search ? { search } : {}, {
                preserveState: true,
                replace: true,
                onFinish: () => setLoading(false),
            });
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setSearch('');
            router.get('/operational-reports', {}, { preserveState: true });
        }
    };

    const getStatusBadge = (value: number) => {
        if (!value) {
            return 'bg-gray-100 text-gray-500';
        }

        if (value >= 4.5) {
            return 'bg-green-100 text-green-700';
        }

        if (value >= 3.5) {
            return 'bg-blue-100 text-blue-700';
        }
        
        if (value >= 2.5) {
            return 'bg-yellow-100 text-yellow-700';
        }
        
        return 'bg-red-100 text-red-700';
    };

    const getStatusLabel = (value: number) => {
        if (!value) {
            return '-';
        }

        if (value >= 4.5) {
            return 'Sangat Baik';
        }
        
        if (value >= 3.5) {
            return 'Baik';
        }

        if (value >= 2.5) {
            return 'Cukup';
        }

        if (value >= 1.5) {
            return 'Kurang';
        }

        return 'Sangat Kurang';
    };

    return (
        <>
            <Head title="Laporan Operasional" />

            <div className="flex flex-col gap-4 p-4">
                {/* HEADER */}
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <Button className="mb-2 w-fit cursor-pointer bg-green-600 hover:bg-green-700 sm:mb-0">
                        <ListChecks />
                        Rekap Laporan
                    </Button>

                    <div className="relative">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                            size={16}
                        />

                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pr-10 pl-10"
                        />

                        {loading && (
                            <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                <Spinner className="size-4" />
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="w-full overflow-x-auto rounded-lg border">
                    <table className="table min-w-full text-center text-sm">
                        <thead>
                            <tr className="bg-secondary">
                                <th className="max-w-fit p-2">No</th>
                                <th className="p-2">Tanggal</th>
                                <th className="p-2">Operator</th>
                                <th className="p-2">Unit</th>
                                <th className="p-2">Inlet</th>
                                <th className="p-2">Outlet</th>
                                <th className="p-2">Catatan</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reports?.data
                                ?.filter((item: any) => item !== null)
                                ?.map((report: any, index: number) => (
                                    <tr
                                        key={report.id}
                                        onClick={() =>
                                            router.visit(
                                                `/operational-reports/${report.id}`,
                                            )
                                        }
                                        className={`cursor-pointer transition hover:bg-secondary ${
                                            index % 2 === 0
                                                ? 'bg-white'
                                                : 'bg-muted/50'
                                        }`}
                                    >
                                        <td className="max-w-fit p-4">
                                            {reports.from + index}
                                        </td>

                                        <td className="p-4">
                                            {new Date(
                                                report.created_at,
                                            ).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </td>

                                        <td className="p-4">
                                            {report.user?.name}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs ${getStatusBadge(
                                                    report.unit_avg,
                                                )}`}
                                            >
                                                {getStatusLabel(
                                                    report.unit_avg,
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs ${getStatusBadge(
                                                    report.inlet_avg,
                                                )}`}
                                            >
                                                {getStatusLabel(
                                                    report.inlet_avg,
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs ${getStatusBadge(
                                                    report.outlet_avg,
                                                )}`}
                                            >
                                                {getStatusLabel(
                                                    report.outlet_avg,
                                                )}
                                            </span>
                                        </td>

                                        <td className="max-w-xs truncate p-4 text-sm whitespace-nowrap sm:table-cell">
                                            {report.note}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <Pagination className="my-4">
                    <PaginationContent>
                        {/* PREVIOUS */}
                        <PaginationItem>
                            <PaginationPrevious
                                href={reports.prev_page_url || '#'}
                                onClick={(e) => {
                                    e.preventDefault();

                                    if (reports.prev_page_url) {
                                        router.visit(reports.prev_page_url, {
                                            preserveState: true,
                                            replace: true,
                                        });
                                    }
                                }}
                            />
                        </PaginationItem>

                        {/* NUMBER */}
                        {reports.links.map((link: any, index: number) => {
                            if (
                                link.label.includes('Previous') ||
                                link.label.includes('Next')
                            ) {
                                return null;
                            }

                            if (link.label === '...') {
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }

                            return (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href={link.url || '#'}
                                        isActive={link.active}
                                        onClick={(e) => {
                                            e.preventDefault();

                                            if (link.url) {
                                                router.visit(link.url, {
                                                    preserveState: true,
                                                    replace: true,
                                                });
                                            }
                                        }}
                                    >
                                        {link.label}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        {/* NEXT */}
                        <PaginationItem>
                            <PaginationNext
                                href={reports.next_page_url || '#'}
                                onClick={(e) => {
                                    e.preventDefault();

                                    if (reports.next_page_url) {
                                        router.visit(reports.next_page_url, {
                                            preserveState: true,
                                            replace: true,
                                        });
                                    }
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
}

OperationalReports.layout = {
    breadcrumbs: [
        {
            title: 'Laporan Operasional',
        },
    ],
};
