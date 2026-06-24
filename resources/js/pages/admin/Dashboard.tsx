import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Calendar1, Droplets, SquareChartGantt } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

import ProjectRequired from '@/components/project/project-required';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

import type { ChartConfig } from '@/components/ui/chart';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type Unit = {
    id: number;
    name: string;
    latest_test?: {
        condition: string;
    } | null;
};

type WaterParameter = {
    id: number;
    name: string;
};

type ChartItem = {
    date: string;
    inlet: number | null;
    outlet: number | null;
};

type RecentReport = {
    id: number;
    note: string;
    created_at: string;
    unit_avg: number;
    inlet: {
        meet: number;
        not_meet: number;
    };
    outlet: {
        meet: number;
        not_meet: number;
    };
};

type Operator = {
    id: number;
    name: string;
    email: string;
    image?: string | null;
};

type Props = {
    units: Unit[];
    operators: Operator[];
    recentReports: RecentReport[];
    datesWithReports: string[];
    waterParameters: WaterParameter[];
    chartData: ChartItem[];
    selectedParameter: number;
    reportsCount: number;
    todayReport: boolean;
};

export default function Dashboard({
    units,
    operators,
    recentReports,
    datesWithReports,
    waterParameters,
    chartData,
    selectedParameter,
    reportsCount,
    todayReport,
}: Props) {
    // ================= BADGE COLOR =================
    const getConditionBadge = (condition: string) => {
        switch (condition.toLowerCase()) {
            case 'sangat baik':
                return 'bg-green-100 text-green-700';

            case 'baik':
                return 'bg-blue-100 text-blue-700';

            case 'cukup':
                return 'bg-yellow-100 text-yellow-700';

            case 'kurang':
                return 'bg-red-100 text-red-700';

            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const [parameter, setParameter] = useState(String(selectedParameter));

    const reportDates = datesWithReports.map((date) => new Date(date));

    const chartConfig = {
        inlet: {
            label: 'Inlet',
            color: '#facc15',
        },

        outlet: {
            label: 'Outlet',
            color: '#22c55e',
        },
    } satisfies ChartConfig;

    const yDomain = useMemo(() => {
        const values = chartData
            .flatMap((item) => [item.inlet, item.outlet])
            .filter((value): value is number => value !== null);

        const max = values.length ? Math.max(...values) : 0;

        return [0, Math.ceil(max * 1.2)];
    }, [chartData]);

    const currentStatus = todayReport ? 'Sudah Input' : 'Belum Input';
    const getStatusBadge = (value: number) => {
        if (!value) {
            return 'bg-muted text-muted-foreground';
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

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <>
            <ProjectRequired>
                <Head title="Dashboard Admin" />

                {/* ================= HEADER ================= */}
                <div className="flex flex-col gap-4 p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Operational Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Realtime Monitoring condition and performance of
                                Waste Water Treatment Plant system.
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* ================= GREETING ================= */}
                    <Card className="relative overflow-hidden border-0 bg-linear-to-br from-blue-600 via-blue-700 to-cyan-600 py-0 text-white shadow-xl">
                        {/* BACKGROUND EFFECT */}
                        <div className="absolute top-0 right-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

                        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl" />

                        <CardContent className="relative flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">
                            {/* LEFT */}
                            <div className="max-w-2xl">
                                <div className="mb-3 flex w-fit flex-row items-center text-sm text-blue-100">
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
                                    Operational Dashboard
                                </h1>

                                <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-100 lg:text-base">
                                    Monitor kondisi unit IPAL, parameter
                                    kualitas air, aktivitas operator, dan
                                    laporan operasional secara realtime dalam
                                    satu dashboard terintegrasi.
                                </p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Button
                                        className="cursor-pointer bg-white text-blue-700 transition-transform duration-500 hover:scale-105 hover:bg-blue-50"
                                        onClick={() =>
                                            router.visit('/operational-reports')
                                        }
                                    >
                                        <SquareChartGantt />
                                        Operational Reports
                                    </Button>
                                </div>
                            </div>

                            {/* RIGHT CARD */}
                            <Card className="w-full max-w-sm border-white/10 bg-white/10 text-white backdrop-blur">
                                <CardContent className="space-y-5 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-blue-100">
                                                Status Hari Ini
                                            </p>

                                            <h3 className="text-xl font-semibold">
                                                {currentStatus}
                                            </h3>
                                        </div>

                                        <div
                                            className={`rounded-full p-3 ${
                                                todayReport
                                                    ? 'bg-green-400/20'
                                                    : 'bg-yellow-400/20'
                                            }`}
                                        >
                                            <Droplets
                                                className={`size-6 ${
                                                    todayReport
                                                        ? 'text-cyan-200'
                                                        : 'text-yellow-200'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    <Separator className="bg-white/10" />

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-blue-100">
                                                Reports
                                            </p>

                                            <p className="mt-1 text-2xl font-bold">
                                                {reportsCount}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-blue-100">
                                                Operator
                                            </p>

                                            <p className="mt-1 text-2xl font-bold">
                                                {operators.length}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-blue-100">
                                                Unit
                                            </p>

                                            <p className="mt-1 text-2xl font-bold">
                                                {units.length}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>

                    {/* ================= MAIN LAYOUT ================= */}
                    <div className="grid items-stretch gap-4 lg:grid-cols-10">
                        {/* ================= LEFT SIDE ================= */}
                        <div className="flex min-w-0 flex-col gap-4 lg:col-span-7">
                            {/* ================= UNIT ================= */}
                            <Card>
                                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <CardTitle>
                                        Kondisi Terakhir Unit IPAL
                                    </CardTitle>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="cursor-pointer text-xs"
                                        onClick={() => router.visit('/units')}
                                    >
                                        Lihat Unit
                                    </Button>
                                </CardHeader>

                                <CardContent>
                                    {units.length ? (
                                        <ScrollArea className="w-full whitespace-nowrap">
                                            <div className="flex gap-4 pb-3">
                                                {units.map((unit) => (
                                                    <div
                                                        key={unit.id}
                                                        className="min-w-42.5 rounded-xl border bg-muted/30 p-4"
                                                    >
                                                        <p className="mb-3 line-clamp-2 font-semibold">
                                                            {unit.name}
                                                        </p>

                                                        <Badge
                                                            className={getConditionBadge(
                                                                unit.latest_test
                                                                    ?.condition ??
                                                                    '-',
                                                            )}
                                                        >
                                                            {unit.latest_test
                                                                ?.condition ??
                                                                'Belum ada pengecekan'}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>

                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                    ) : (
                                        <div className="flex h-30 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                                            Belum ada unit pada project ini
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* ================= CHART ================= */}
                            <Card className="h-full">
                                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <CardTitle>Grafik Kondisi Air</CardTitle>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                        {/* LEGEND */}
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-sm bg-yellow-400" />
                                                <span>Inlet</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-sm bg-green-500" />
                                                <span>Outlet</span>
                                            </div>
                                        </div>

                                        {/* SELECT PARAMETER */}
                                        {waterParameters.length ? (
                                            <Select
                                                value={parameter}
                                                onValueChange={(value) => {
                                                    setParameter(value);

                                                    router.get(
                                                        '/dashboard',
                                                        {
                                                            parameter: value,
                                                        },
                                                        {
                                                            preserveState: true,
                                                            replace: true,
                                                        },
                                                    );
                                                }}
                                            >
                                                <SelectTrigger className="w-full sm:w-35">
                                                    <SelectValue placeholder="Parameter" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {waterParameters.map(
                                                        (parameter) => (
                                                            <SelectItem
                                                                key={
                                                                    parameter.id
                                                                }
                                                                value={String(
                                                                    parameter.id,
                                                                )}
                                                            >
                                                                {parameter.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        ) : null}
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    {chartData.length ? (
                                        <div className="h-62.5 w-full sm:h-80">
                                            <ChartContainer
                                                config={chartConfig}
                                                className="h-full w-full"
                                            >
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height="100%"
                                                >
                                                    <AreaChart
                                                        data={chartData}
                                                        margin={{
                                                            left: 12,
                                                            right: 12,
                                                            top: 10,
                                                        }}
                                                    >
                                                        <defs>
                                                            <linearGradient
                                                                id="fillInlet"
                                                                x1="0"
                                                                y1="0"
                                                                x2="0"
                                                                y2="1"
                                                            >
                                                                <stop
                                                                    offset="5%"
                                                                    stopColor="#facc15"
                                                                    stopOpacity={
                                                                        0.5
                                                                    }
                                                                />

                                                                <stop
                                                                    offset="95%"
                                                                    stopColor="#facc15"
                                                                    stopOpacity={
                                                                        0.05
                                                                    }
                                                                />
                                                            </linearGradient>

                                                            <linearGradient
                                                                id="fillOutlet"
                                                                x1="0"
                                                                y1="0"
                                                                x2="0"
                                                                y2="1"
                                                            >
                                                                <stop
                                                                    offset="5%"
                                                                    stopColor="#22c55e"
                                                                    stopOpacity={
                                                                        0.5
                                                                    }
                                                                />

                                                                <stop
                                                                    offset="95%"
                                                                    stopColor="#22c55e"
                                                                    stopOpacity={
                                                                        0.05
                                                                    }
                                                                />
                                                            </linearGradient>
                                                        </defs>

                                                        <CartesianGrid
                                                            vertical={false}
                                                        />

                                                        <XAxis
                                                            dataKey="date"
                                                            tickLine={false}
                                                            axisLine={false}
                                                            tickMargin={8}
                                                        />

                                                        <YAxis
                                                            tickLine={false}
                                                            axisLine={false}
                                                            width={40}
                                                            domain={yDomain}
                                                        />

                                                        <ChartTooltip
                                                            cursor={false}
                                                            content={
                                                                <ChartTooltipContent />
                                                            }
                                                        />

                                                        {/* INLET */}
                                                        <Area
                                                            type="natural"
                                                            dataKey="inlet"
                                                            stroke="#facc15"
                                                            fill="url(#fillInlet)"
                                                            fillOpacity={1}
                                                            strokeWidth={2}
                                                        />

                                                        {/* OUTLET */}
                                                        <Area
                                                            type="natural"
                                                            dataKey="outlet"
                                                            stroke="#22c55e"
                                                            fill="url(#fillOutlet)"
                                                            fillOpacity={1}
                                                            strokeWidth={2}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </ChartContainer>
                                        </div>
                                    ) : (
                                        <div className="flex h-62.5 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                                            Belum ada data water test
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* ================= RIGHT SIDE ================= */}
                        <div className="flex min-w-0 flex-col gap-4 lg:col-span-3">
                            {/* ================= CALENDAR ================= */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Kalender</CardTitle>
                                </CardHeader>

                                <CardContent className="flex justify-center">
                                    <Calendar
                                        mode="single"
                                        selected={new Date()}
                                        className="w-full"
                                        modifiers={{
                                            hasReport: reportDates,
                                        }}
                                        modifiersClassNames={{
                                            hasReport:
                                                'bg-blue-50 text-blue-700 border border-blue-200 rounded-lg',
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            {/* ================= OPERATORS ================= */}
                            <Card className="flex-1">
                                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <CardTitle>Operator</CardTitle>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="cursor-pointer text-xs"
                                        onClick={() => router.visit('/users')}
                                    >
                                        Lihat Semua
                                    </Button>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {operators.length ? (
                                        operators.map((operator) => (
                                            <div
                                                key={operator.id}
                                                className="flex items-center gap-3 rounded-lg border p-2 sm:p-3"
                                            >
                                                <Avatar className="h-10 w-10">
                                                    {operator.image ? (
                                                        <img
                                                            src={`/storage/${operator.image}`}
                                                            alt={operator.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <AvatarFallback>
                                                            {operator.name.charAt(
                                                                0,
                                                            )}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">
                                                        {operator.name}
                                                    </p>

                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {operator.email}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                            Belum ada operator pada project ini
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    {/* ================= RECENT REPORTS ================= */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>
                                    Laporan Operasional Terakhir
                                </CardTitle>
                            </div>

                            <Button
                                size="sm"
                                variant="outline"
                                className="cursor-pointer text-xs"
                                onClick={() =>
                                    router.visit('/operational-reports')
                                }
                            >
                                Lihat Semua
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {recentReports.length ? (
                                recentReports.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() =>
                                            router.visit(
                                                `/operational-reports/${item.id}`,
                                            )
                                        }
                                        className="cursor-pointer rounded-xl border bg-muted/20 p-4 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-900 dark:hover:bg-blue-950/30"
                                    >
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                            {/* LEFT */}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold">
                                                    {formatDate(
                                                        item.created_at,
                                                    )}
                                                </p>

                                                <p className="mt-1 line-clamp-2 max-w-xl text-sm text-muted-foreground">
                                                    {item.note || '-'}
                                                </p>
                                            </div>

                                            {/* RIGHT */}
                                            <div className="flex items-center gap-2 overflow-x-auto lg:justify-end">
                                                <Badge
                                                    className={getStatusBadge(
                                                        item.unit_avg,
                                                    )}
                                                >
                                                    Unit:{' '}
                                                    {getStatusLabel(
                                                        item.unit_avg,
                                                    )}
                                                </Badge>

                                                <div className="border-l px-4">
                                                    <Badge className="bg-green-100 text-green-700">
                                                        Inlet Meet:{' '}
                                                        {item.inlet.meet}
                                                    </Badge>
                                                    <Separator />
                                                    <Badge className="bg-orange-100 text-orange-700">
                                                        Inlet Not:{' '}
                                                        {item.inlet.not_meet}
                                                    </Badge>
                                                </div>
                                                <div className="border-l px-4">
                                                    <Badge className="bg-green-100 text-green-700">
                                                        Outlet Meet:{' '}
                                                        {item.outlet.meet}
                                                    </Badge>
                                                    <Separator />
                                                    <Badge className="bg-orange-100 text-orange-700">
                                                        Outlet Not:{' '}
                                                        {item.outlet.not_meet}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                    Belum ada laporan operasional
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </ProjectRequired>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Home',
            href: '/dashboard',
        },
        {
            title: 'Dashboard',
        },
    ],
};
