import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

type Report = {
    id: number;
    created_at: string;
    unit_avg: number;
    note: string;

    inlet: {
        meet: number;
        not_meet: number;
    };

    outlet: {
        meet: number;
        not_meet: number;
    };
};

export default function History({ reports, filters }: any) {
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState(filters?.search || '');

    // ================= SEARCH =================
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        const delay = setTimeout(() => {
            router.get(
                '/operational-reports/history',
                search ? { search } : {},
                {
                    preserveState: true,
                    replace: true,
                    onFinish: () => setLoading(false),
                },
            );
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        return {
            hari: date.toLocaleDateString('id-ID', {
                weekday: 'long',
            }),
            tanggal: date
                .toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                })
                .replace(/\//g, '-'),
        };
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
            <Head title="Riwayat Laporan" />

            <div className="flex flex-col gap-4 p-6">
                {/* ================= HEADER ================= */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Report History
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Monitoring history and operational reporting
                            records.
                        </p>
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                            size={16}
                        />

                        <Input
                            placeholder="Cari laporan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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

                {/* ================= TABLE ================= */}
                <div className="w-full overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-center text-sm">
                        <thead>
                            <tr className="bg-secondary">
                                <th className="p-4">No</th>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4 whitespace-nowrap">
                                    Rata-rata Unit
                                </th>
                                <th className="p-4">Inlet</th>
                                <th className="p-4">Outlet</th>
                                <th className="p-4">Catatan</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reports?.data?.length ? (
                                reports.data.map(
                                    (report: Report, index: number) => (
                                        <tr
                                            key={report.id}
                                            onClick={() =>
                                                router.visit(
                                                    `/operational-reports/history/${report.id}`,
                                                )
                                            }
                                            className={`cursor-pointer transition hover:bg-secondary ${
                                                index % 2 === 0
                                                    ? 'bg-white'
                                                    : 'bg-muted/40'
                                            }`}
                                        >
                                            <td className="p-4">
                                                {reports.from + index}
                                            </td>

                                            <td className="p-4">
                                                {(() => {
                                                    const { hari, tanggal } =
                                                        formatDate(
                                                            report.created_at,
                                                        );

                                                    return (
                                                        <div>
                                                            <div>{hari},</div>
                                                            <div className="whitespace-nowrap">
                                                                {tanggal}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </td>

                                            <td className="p-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs whitespace-nowrap ${getStatusBadge(
                                                        report.unit_avg,
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        report.unit_avg,
                                                    )}{' '}
                                                    ({report.unit_avg})
                                                </span>
                                            </td>

                                            {/* INLET */}
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                                                        Memenuhi:{' '}
                                                        {report.inlet.meet}
                                                    </span>

                                                    <Separator className="w-16" />

                                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700">
                                                        Tidak:{' '}
                                                        {report.inlet.not_meet}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* OUTLET */}
                                            <td className="p-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                                                        Memenuhi:{' '}
                                                        {report.outlet.meet}
                                                    </span>

                                                    <Separator className="w-16" />

                                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700">
                                                        Tidak:{' '}
                                                        {report.outlet.not_meet}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="max-w-xs truncate p-4 text-sm whitespace-nowrap sm:table-cell">
                                                {report.note}
                                            </td>
                                            <td className="p-4">
                                                <Button
                                                    size="sm"
                                                    className="cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        router.get(
                                                            `/operational-reports/history/${report.id}`,
                                                        );
                                                    }}
                                                >
                                                    Detail
                                                </Button>
                                            </td>
                                        </tr>
                                    ),
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        Belum ada laporan operasional
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ================= PAGINATION ================= */}
                {reports?.last_page > 1 && (
                    <Pagination className="my-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href={reports.prev_page_url || '#'}
                                    onClick={(e) => {
                                        e.preventDefault();

                                        if (reports.prev_page_url) {
                                            router.visit(reports.prev_page_url);
                                        }
                                    }}
                                />
                            </PaginationItem>

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
                                                    router.visit(link.url);
                                                }
                                            }}
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    href={reports.next_page_url || '#'}
                                    onClick={(e) => {
                                        e.preventDefault();

                                        if (reports.next_page_url) {
                                            router.visit(reports.next_page_url);
                                        }
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </>
    );
}

History.layout = {
    breadcrumbs: [
        {
            title: 'Home',
            href: '/dashboard',
        },
        {
            title: 'Riwayat Laporan',
        },
    ],
};
