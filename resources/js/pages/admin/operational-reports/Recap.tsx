import { Head } from '@inertiajs/react';
import {
    Activity,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Users,
} from 'lucide-react';

import ComplianceChart from '@/components/operational-reports/CompilanceChart';
import ParameterRecapTable from '@/components/operational-reports/ParameterRecapTable';
import ReportsTable from '@/components/operational-reports/ReportsTable';
import UnitRecapTable from '@/components/operational-reports/UnitRecapTable';
import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type ChartItem = {
    date: string;
    compliance: number;
};

type Props = {
    reports: any[];
    from: string;
    to: string;

    chartData: ChartItem[];

    unitRecap: {
        name: string;
        avg: number;
        status: string;
    }[];

    parameterRecap: {
        name: string;
        min: number;
        max: number;
        avg_inlet: number;
        avg_outlet: number;
    }[];
};

export default function Recap({
    reports,
    from,
    to,
    chartData,
    unitRecap,
    parameterRecap,
}: Props) {
    // ================= TOTAL REPORT =================
    const totalReports = reports.length;

    // ================= OPERATOR ACTIVE =================
    const activeOperators = [...new Set(reports.map((r) => r.user?.id))].length;

    // ================= UNIT AVG =================
    const unitAverage =
        unitRecap.length > 0
            ? (
                  unitRecap.reduce((sum, item) => sum + item.avg, 0) /
                  unitRecap.length
              ).toFixed(1)
            : '0';

    // ================= OUTLET COMPLIANCE =================
    const outletCompliance =
        chartData.length > 0
            ? (
                  chartData.reduce((sum, item) => sum + item.compliance, 0) /
                  chartData.length
              ).toFixed(1)
            : '0';

    return (
        <>
            <Head title="Rekap Laporan" />

            <div className="space-y-6 p-6">
                {/* ================= HEADER ================= */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Operational Reports Recap
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Monitoring summary and operational reporting recap
                            for IPAL units.
                        </p>
                    </div>

                    {/* DATE RANGE */}
                    <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                            <CalendarDays size={20} />
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Periode Rekap
                            </p>

                            <p className="text-sm font-semibold">
                                {from} s/d {to}
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* ================= STATS ================= */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {/* TOTAL REPORT */}
                    <Card className="rounded-2xl">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Report
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {totalReports}
                                </p>
                            </div>

                            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                                <ClipboardList size={26} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ACTIVE OPERATOR */}
                    <Card className="rounded-2xl">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Operator Aktif
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {activeOperators}
                                </p>
                            </div>

                            <div className="rounded-xl bg-green-100 p-3 text-green-700">
                                <Users size={26} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* UNIT AVG */}
                    <Card className="rounded-2xl">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Rata-rata Unit
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {unitAverage}
                                </p>
                            </div>

                            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700">
                                <Activity size={26} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* OUTLET COMPLIANCE */}
                    <Card className="rounded-2xl">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Outlet Compliance
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {outletCompliance}%
                                </p>
                            </div>

                            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                                <CheckCircle2 size={26} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ================= CHART ================= */}
                <div className="rounded-xl border">
                    <div className="border-b p-4">
                        <h2 className="text-lg font-semibold">
                            Tren Kepatuhan Outlet IPAL
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Persentase parameter outlet yang memenuhi baku mutu
                        </p>
                    </div>

                    <ComplianceChart chartData={chartData} />
                </div>

                {/* ================= UNIT RECAP ================= */}
                <div className="rounded-xl border">
                    <div className="border-b p-4">
                        <h2 className="text-lg font-semibold">
                            Rekap Kondisi Unit IPAL
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Rata-rata kondisi unit selama periode
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <UnitRecapTable unitRecap={unitRecap} />
                    </div>
                </div>

                {/* ================= PARAMETER RECAP ================= */}
                <div className="rounded-xl border">
                    <div className="border-b p-4">
                        <h2 className="text-lg font-semibold">
                            Rekap Parameter Air
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Rata-rata parameter selama periode
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <ParameterRecapTable parameterRecap={parameterRecap} />
                    </div>
                </div>

                {/* ================= REPORT TABLE ================= */}
                <div className="rounded-xl border">
                    <div className="border-b p-4">
                        <h2 className="text-lg font-semibold">
                            Rekap Laporan Operasional
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <ReportsTable reports={reports} />
                    </div>
                </div>

                {/* ================= ACTION ================= */}
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            window.open(
                                `/operational-reports/recap/print?from=${from}&to=${to}`,
                                '_blank',
                            );
                        }}
                        className="cursor-pointer"
                    >
                        Cetak Rekap (PDF)
                    </Button>
                </div>
            </div>
        </>
    );
}

Recap.layout = {
    breadcrumbs: [
        {
            title: 'Home',
            href: '/dashboard',
        },
        {
            title: 'Laporan Operasional',
            href: '/operational-reports',
        },
        {
            title: 'Rekap Laporan Operasional',
        },
    ],
};
