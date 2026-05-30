import { Head, router } from '@inertiajs/react';
import { ListChecks, Search } from 'lucide-react';
import { CalendarDays } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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

export default function OperationalReports({ reports, filters }: any) {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    // ================= SEARCH =================
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        const delay = setTimeout(() => {
            router.get(
                '/operational-reports',
                search
                    ? {
                          search,
                      }
                    : {},
                {
                    preserveState: true,
                    replace: true,
                    onFinish: () => setLoading(false),
                },
            );
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setSearch('');

            router.get(
                '/operational-reports',
                {},
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const hari = date.toLocaleDateString('id-ID', {
            weekday: 'long',
        });
        const tanggal = date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        return `${hari}, ${tanggal.replace(/\//g, '-')}`;
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

    const [openRecap, setOpenRecap] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    return (
        <>
            <Head title="Laporan Operasional" />

            <div className="flex flex-col gap-4 p-6">
                {/* ================= HEADER ================= */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Operational Reports
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Real-time monitoring and compliance tracking for
                            IPAL units.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative w-full sm:w-80">
                            <Search
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                                size={16}
                            />

                            <Input
                                placeholder="Cari laporan..."
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

                        <Dialog open={openRecap} onOpenChange={setOpenRecap}>
                            <DialogTrigger asChild>
                                <Button className="mb-2 w-fit cursor-pointer bg-green-600 transition-transform duration-500 hover:scale-105 hover:bg-green-700 sm:mb-0">
                                    <ListChecks />
                                    Rekap Laporan
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>
                                        Rekap Laporan Operasional
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">
                                    {/* TANGGAL AWAL */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Tanggal Awal
                                        </label>

                                        <Input
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) =>
                                                setFromDate(e.target.value)
                                            }
                                        />
                                    </div>

                                    {/* TANGGAL AKHIR */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Tanggal Akhir
                                        </label>

                                        <Input
                                            type="date"
                                            value={toDate}
                                            onChange={(e) =>
                                                setToDate(e.target.value)
                                            }
                                        />
                                    </div>

                                    {/* ACTION */}
                                    <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                                        {/* PREVIEW */}
                                        <Button
                                            className="flex-1 cursor-pointer"
                                            disabled={!fromDate || !toDate}
                                            onClick={() => {
                                                router.visit(
                                                    `/operational-reports/recap?from=${fromDate}&to=${toDate}`,
                                                );
                                            }}
                                        >
                                            <CalendarDays />
                                            Preview Rekap
                                        </Button>

                                        {/* PRINT */}
                                        <Button
                                            variant="outline"
                                            className="flex-1 cursor-pointer"
                                            disabled={!fromDate || !toDate}
                                            onClick={() => {
                                                window.open(
                                                    `/operational-reports/recap/print?from=${fromDate}&to=${toDate}`,
                                                    '_blank',
                                                );
                                            }}
                                        >
                                            Cetak PDF
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Separator />

                {/* ================= TABLE ================= */}
                <div className="w-full overflow-x-auto rounded-lg border">
                    <table className="table min-w-full text-center text-sm">
                        <thead>
                            <tr className="bg-secondary">
                                <th className="max-w-fit p-4">No</th>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Operator</th>
                                <th className="p-4">Rata-rata Unit</th>
                                <th className="p-4">Inlet</th>
                                <th className="p-4">Outlet</th>
                                <th className="p-4">Catatan</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reports?.data?.length ? (
                                reports.data
                                    .filter((item: any) => item !== null)
                                    .map((report: any, index: number) => (
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
                                                {report.created_at
                                                    ? formatDate(
                                                          report.created_at,
                                                      )
                                                    : '-'}
                                            </td>
                                            <td className="p-4">
                                                {report.user?.name ??
                                                    'Operator tidak tersedia'}
                                            </td>
                                            {/* UNIT */}
                                            <td className="p-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs ${getStatusBadge(
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
                                            <td className="p-4">
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
                                                {report.note ||
                                                    'Tidak ada catatan'}
                                            </td>
                                        </tr>
                                    ))
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
                            {/* PREVIOUS */}
                            <PaginationItem>
                                <PaginationPrevious
                                    href={reports.prev_page_url || '#'}
                                    onClick={(e) => {
                                        e.preventDefault();

                                        if (reports.prev_page_url) {
                                            router.visit(
                                                reports.prev_page_url,
                                                {
                                                    preserveState: true,
                                                    replace: true,
                                                },
                                            );
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
                                            router.visit(
                                                reports.next_page_url,
                                                {
                                                    preserveState: true,
                                                    replace: true,
                                                },
                                            );
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

OperationalReports.layout = {
    breadcrumbs: [
        {
            title: 'Home',
            href: '/dashboard',
        },
        {
            title: 'Laporan Operasional',
        },
    ],
};
