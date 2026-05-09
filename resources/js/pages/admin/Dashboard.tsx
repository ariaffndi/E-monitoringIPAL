import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

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

type Note = {
    id: number;
    note: string;
    created_at: string;
};

type Operator = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    units: Unit[];
    operators: Operator[];
    notes: Note[];
    datesWithReports: string[];

    waterParameters: WaterParameter[];
    chartData: ChartItem[];
    selectedParameter: number;
};

export default function Dashboard({
    units,
    operators,
    notes,
    datesWithReports,

    waterParameters,
    chartData,
    selectedParameter,
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

    return (
        <>
            <Head title="Dashboard Admin" />

            {/* ================= MAIN LAYOUT ================= */}
            <div className="grid gap-4 p-4 lg:grid-cols-10">
                {/* ================= LEFT SIDE ================= */}
                <div className="min-w-0 space-y-4 lg:col-span-7">
                    {/* ================= UNIT ================= */}
                    <Card>
                        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle>Kondisi Unit IPAL</CardTitle>

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
                            <ScrollArea className="w-full whitespace-nowrap">
                                <div className="flex gap-4 pb-3">
                                    {units.map((unit) => (
                                        <div
                                            key={unit.id}
                                            className="min-w-[170px] rounded-xl border bg-muted/30 p-4"
                                        >
                                            <p className="mb-3 line-clamp-2 font-semibold">
                                                {unit.name}
                                            </p>

                                            <Badge
                                                className={getConditionBadge(
                                                    unit.latest_test
                                                        ?.condition ?? '-',
                                                )}
                                            >
                                                {unit.latest_test?.condition ??
                                                    '-'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>

                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* ================= CHART ================= */}
                    <Card>
                        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle>Water Test</CardTitle>

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
                                    <SelectTrigger className="w-full sm:w-[140px]">
                                        <SelectValue placeholder="Parameter" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {waterParameters.map((parameter) => (
                                            <SelectItem
                                                key={parameter.id}
                                                value={String(parameter.id)}
                                            >
                                                {parameter.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="h-[250px] w-full sm:h-[320px]">
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
                                                        stopOpacity={0.5}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#facc15"
                                                        stopOpacity={0.05}
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
                                                        stopOpacity={0.5}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#22c55e"
                                                        stopOpacity={0.05}
                                                    />
                                                </linearGradient>
                                            </defs>

                                            <CartesianGrid vertical={false} />

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
                        </CardContent>
                    </Card>

                    {/* ================= NOTES ================= */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Catatan</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {notes.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-lg border p-3 text-sm"
                                >
                                    {item.note}
                                </div>
                            ))}
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
                            {/* ❌ border dihapus */}
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
                    {/* ✅ flex-1 agar memenuhi sisa tinggi */}
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
                                        <Avatar>
                                            <AvatarFallback>
                                                {operator.name.charAt(0)}
                                            </AvatarFallback>
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
                                <p className="text-sm text-muted-foreground">
                                    Belum ada operator
                                </p>
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
            href: dashboard(),
        },
    ],
};
