import { Head, router } from '@inertiajs/react';
import {
    ArrowRight,
    ClipboardList,
    Droplets,
    FileClock,
    Flame,
    PlusCircle,
    Calendar1,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type DashboardProps = {
    user: {
        name: string;
    };

    todayReport: boolean;

    stats: {
        month: number;
        week: number;
        streak: number;
    };

    latestReport: {
        id: number;
        created_at: string;
        unit_avg: number;
        inlet_avg: number;
        outlet_avg: number;
    } | null;

    recentReports: any[];
};

export default function Dashboard(props: Partial<DashboardProps>) {
    const user = props.user ?? { name: 'User' };

    const todayReport = props.todayReport ?? false;

    const stats = props.stats ?? {
        month: 0,
        week: 0,
        streak: 0,
    };

    const latestReport = props.latestReport ?? null;

    const recentReports = props.recentReports ?? [];

    // ================= HELPER =================
    const getStatusBadge = (value: number) => {
        if (!value) {
            return 'bg-muted text-muted-foreground';
        }

        if (value >= 4.5) {
            return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
        }

        if (value >= 3.5) {
            return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
        }

        if (value >= 2.5) {
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
        }

        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
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

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Dashboard Operator
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Track and review your WWTP report submissions and
                            data entry history.
                        </p>
                    </div>
                </div>

                <Separator />
                {/* ================= HERO ================= */}
                <Card className="relative overflow-hidden border-0 bg-linear-to-br from-blue-600 via-blue-700 to-cyan-600 py-0 text-white shadow-xl">
                    <div className="absolute top-0 right-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl" />
                    <CardContent className="relative flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="flex w-fit flex-row items-center">
                                <Calendar1 size={16} className="mr-2" />
                                {new Date()
                                    .toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })
                                    .replace('.', '')
                                    .replace(/\b\w/g, (char) =>
                                        char.toUpperCase(),
                                    )}
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                                Halo, {user.name} 👋
                            </h1>
                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-100 lg:text-base">
                                {todayReport
                                    ? 'Laporan operasional hari ini sudah berhasil diinput dan sistem monitoring berjalan normal.'
                                    : 'Kamu belum menginput laporan operasional hari ini. Pastikan monitoring dilakukan secara rutin.'}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                {!todayReport && (
                                    <Button
                                        className="cursor-pointer bg-white text-blue-700 transition-transform duration-500 hover:scale-105 hover:bg-blue-50"
                                        onClick={() =>
                                            router.visit(
                                                '/operational-reports/create',
                                            )
                                        }
                                    >
                                        <PlusCircle />
                                        Input Laporan
                                    </Button>
                                )}

                                <Button
                                    variant="secondary"
                                    className="cursor-pointer border border-white/20 bg-white/10 text-white transition-transform duration-500 hover:scale-105 hover:bg-white/20"
                                    onClick={() =>
                                        router.visit(
                                            '/operational-reports/history',
                                        )
                                    }
                                >
                                    <FileClock />
                                    Riwayat Laporan
                                </Button>
                            </div>
                        </div>

                        <Card className="w-full max-w-sm border-white/10 bg-white/10 text-white backdrop-blur">
                            <CardContent className="space-y-5 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-100">
                                            Status Operator
                                        </p>

                                        <h3 className="text-xl font-semibold">
                                            {todayReport
                                                ? 'Sudah input laporan'
                                                : 'Belum input laporan'}
                                        </h3>
                                    </div>

                                    <div className="rounded-full bg-green-400/20 p-3">
                                        <Droplets className="size-6 text-cyan-200" />
                                    </div>
                                </div>

                                <Separator className="bg-white/10" />

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-blue-100">
                                            Bulan Ini
                                        </p>

                                        <p className="mt-1 text-2xl font-bold">
                                            {stats.month}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-blue-100">
                                            Minggu Ini
                                        </p>

                                        <p className="mt-1 text-2xl font-bold">
                                            {stats.week}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>

                {/* ================= QUICK STATS ================= */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Bulan Ini
                                </p>

                                <h3 className="mt-2 text-3xl font-bold">
                                    {stats.month}
                                </h3>
                            </div>

                            <div className="rounded-2xl bg-blue-100 p-4 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                <ClipboardList className="size-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Minggu Ini
                                </p>

                                <h3 className="mt-2 text-3xl font-bold">
                                    {stats.week}
                                </h3>
                            </div>

                            <div className="rounded-2xl bg-cyan-100 p-4 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                                <FileClock className="size-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Streak Input
                                </p>

                                <h3 className="mt-2 text-3xl font-bold">
                                    {stats.streak}
                                </h3>

                                <p className="text-xs text-muted-foreground">
                                    Hari berturut-turut
                                </p>
                            </div>

                            <div className="rounded-2xl bg-orange-100 p-4 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                                <Flame className="size-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status Hari Ini
                                </p>

                                <h3 className="mt-2 text-xl font-bold">
                                    {todayReport
                                        ? 'Sudah Input'
                                        : 'Belum Input'}
                                </h3>
                            </div>

                            <Badge
                                className={
                                    todayReport
                                        ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                                        : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                }
                            >
                                {todayReport ? 'Aktif' : 'Pending'}
                            </Badge>
                        </CardContent>
                    </Card>
                </div>

                {/* ================= STATUS & HISTORY ================= */}
                <div className="grid gap-6 xl:grid-cols-5">
                    {/* STATUS */}
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <CardTitle>Status Terakhir</CardTitle>

                            <CardDescription>
                                Kondisi hasil monitoring terakhir
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {latestReport ? (
                                <div className="space-y-4">
                                    <div className="rounded-xl border bg-muted/30 p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="font-medium">Unit</p>

                                            <Badge
                                                className={getStatusBadge(
                                                    latestReport.unit_avg,
                                                )}
                                            >
                                                {getStatusLabel(
                                                    latestReport.unit_avg,
                                                )}
                                            </Badge>
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Monitoring unit IPAL terbaru
                                        </p>
                                    </div>

                                    <div className="rounded-xl border bg-muted/30 p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="font-medium">Inlet</p>

                                            <Badge
                                                className={getStatusBadge(
                                                    latestReport.inlet_avg,
                                                )}
                                            >
                                                {getStatusLabel(
                                                    latestReport.inlet_avg,
                                                )}
                                            </Badge>
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Kondisi parameter air masuk
                                        </p>
                                    </div>

                                    <div className="rounded-xl border bg-muted/30 p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="font-medium">
                                                Outlet
                                            </p>

                                            <Badge
                                                className={getStatusBadge(
                                                    latestReport.outlet_avg,
                                                )}
                                            >
                                                {getStatusLabel(
                                                    latestReport.outlet_avg,
                                                )}
                                            </Badge>
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Kondisi parameter air keluar
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
                                    Belum ada data monitoring
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* HISTORY */}
                    <Card className="xl:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>Riwayat Terakhir</CardTitle>

                                <CardDescription>
                                    Aktivitas laporan operasional terbaru
                                </CardDescription>
                            </div>

                            <Button
                                variant="ghost"
                                className="cursor-pointer"
                                onClick={() =>
                                    router.visit('/operational-reports/history')
                                }
                            >
                                Lihat Semua
                                <ArrowRight />
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {recentReports.length ? (
                                recentReports.map((item: any) => (
                                    <div
                                        key={item.id}
                                        onClick={() =>
                                            router.visit(
                                                `/operational-reports/history/${item.id}`,
                                            )
                                        }
                                        className="cursor-pointer rounded-2xl border bg-muted/20 p-4 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-900 dark:hover:bg-blue-950/30"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <h4 className="font-semibold">
                                                    Laporan Operasional
                                                </h4>

                                                <p className="text-sm text-muted-foreground">
                                                    {item.note || '-'}
                                                </p>
                                            </div>

                                            <Badge variant="secondary">
                                                {formatDate(item.created_at)}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-xl border border-dashed py-12 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada laporan operasional
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
        },
    ],
};
