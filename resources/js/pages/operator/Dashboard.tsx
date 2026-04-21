/* eslint-disable @stylistic/padding-line-between-statements */
/* eslint-disable curly */
import { Head, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    // helper status
    const getStatusBadge = (value: number) => {
        if (!value) return 'bg-gray-100 text-gray-500';
        if (value >= 4.5) return 'bg-green-100 text-green-700';
        if (value >= 3.5) return 'bg-blue-100 text-blue-700';
        if (value >= 2.5) return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    const getStatusLabel = (value: number) => {
        if (!value) return '-';
        if (value >= 4.5) return 'Sangat Baik';
        if (value >= 3.5) return 'Baik';
        if (value >= 2.5) return 'Cukup';
        if (value >= 1.5) return 'Kurang';
        return 'Sangat Kurang';
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
        });
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4">
                {/* ================= WELCOME ================= */}
                <Card>
                    <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Halo, {user.name} 👋
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {todayReport
                                    ? 'Kamu sudah mengisi laporan hari ini'
                                    : 'Kamu belum mengisi laporan hari ini'}
                            </p>
                        </div>

                        {!todayReport && (
                            <Button
                                className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                onClick={() =>
                                    router.visit('/operational-reports/create')
                                }
                            >
                                Input Laporan
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* ================= QUICK STATS ================= */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Bulan Ini</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">
                            {stats.month}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Minggu Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">
                            {stats.week}
                        </CardContent>
                    </Card>

                    <Card className="col-span-2 md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-sm">Streak 🔥</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">
                            {stats.streak} hari
                        </CardContent>
                    </Card>
                </div>

                {/* ================= STATUS TERAKHIR ================= */}
                {latestReport && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Terakhir</CardTitle>
                        </CardHeader>

                        <CardContent className="grid gap-4 text-center md:grid-cols-3">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Unit
                                </p>
                                <Badge
                                    className={getStatusBadge(
                                        latestReport.unit_avg,
                                    )}
                                >
                                    {getStatusLabel(latestReport.unit_avg)}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Inlet
                                </p>
                                <Badge
                                    className={getStatusBadge(
                                        latestReport.inlet_avg,
                                    )}
                                >
                                    {getStatusLabel(latestReport.inlet_avg)}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Outlet
                                </p>
                                <Badge
                                    className={getStatusBadge(
                                        latestReport.outlet_avg,
                                    )}
                                >
                                    {getStatusLabel(latestReport.outlet_avg)}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ================= RIWAYAT TERAKHIR ================= */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Riwayat Terakhir</CardTitle>

                        <Button
                            className="cursor-pointer"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                router.visit('/operational-reports/history')
                            }
                        >
                            Lihat Semua
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {recentReports.length ? (
                            recentReports.map((item: any) => (
                                <div
                                    key={item.id}
                                    onClick={() =>
                                        router.visit(
                                            `/operational-reports/history/${item.id}`,
                                        )
                                    }
                                    className="cursor-pointer rounded border p-3 transition hover:bg-muted"
                                >
                                    <p className="text-sm font-medium">
                                        {formatDate(item.created_at)}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {item.note || '-'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Belum ada laporan
                            </p>
                        )}
                    </CardContent>
                </Card>
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
