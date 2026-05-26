import { Head } from '@inertiajs/react';
import ComplianceChart from '@/components/operational-reports/CompilanceChart';
import ParameterRecapTable from '@/components/operational-reports/ParameterRecapTable';
import ReportsTable from '@/components/operational-reports/ReportsTable';
import UnitRecapTable from '@/components/operational-reports/UnitRecapTable';
import { Button } from '@/components/ui/button';

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


    return (
        <>
            <Head title="Rekap Laporan" />

            <div className="space-y-6 p-6">
                {/* HEADER */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        REKAP LAPORAN OPERASIONAL IPAL
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Periode {from} s/d {to}
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        Total Laporan
                    </p>

                    <p className="mt-2 text-2xl font-bold">{reports.length}</p>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        Operator Aktif
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {[...new Set(reports.map((r) => r.user?.id))].length}
                    </p>
                </div>

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