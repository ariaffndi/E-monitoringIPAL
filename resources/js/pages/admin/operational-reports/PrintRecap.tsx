import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import ComplianceChart from '@/components/operational-reports/CompilanceChart';
import ParameterRecapTable from '@/components/operational-reports/ParameterRecapTable';
import ReportsTable from '@/components/operational-reports/ReportsTable';
import UnitRecapTable from '@/components/operational-reports/UnitRecapTable';

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

export default function PrintRecap({
    reports,
    from,
    to,
    chartData,
    unitRecap,
    parameterRecap,
}: Props){

    useEffect(() => {
        setTimeout(() => {
            window.print();
        }, 500);
    }, []);


    return (
        <>
            <Head title="Print Rekap Laporan" />

            <div className="mx-auto max-w-5xl bg-white p-10 text-black">
                {/* KOP */}
                <div className="border-b-2 border-black pb-4 text-center">
                    <h1 className="text-2xl font-bold">
                        PT MITRA PRIMA ENVIRO
                    </h1>

                    <p className="text-sm">Sistem Monitoring IPAL</p>

                    <p className="text-sm">Surabaya, Indonesia</p>
                </div>

                {/* TITLE */}
                <div className="mt-8 text-center">
                    <h2 className="text-xl font-bold uppercase">
                        Rekap Laporan Operasional IPAL
                    </h2>

                    <p className="mt-2 text-sm">
                        Periode {from} s/d {to}
                    </p>
                </div>

                <div className="avoid-break mt-10 rounded border p-4">
                    <h3 className="mb-4 text-lg font-bold">
                        Tren Kepatuhan Outlet IPAL
                    </h3>

                    <ComplianceChart chartData={chartData} printMode />
                </div>

                <div className="mt-10">
                    <h3 className="mb-3 text-lg font-bold">
                        Rekap Kondisi Unit IPAL
                    </h3>

                    <UnitRecapTable unitRecap={unitRecap} />
                </div>

                <div className="mt-10">
                    <h3 className="mb-3 text-lg font-bold">
                        Rekap Parameter Air
                    </h3>

                    <ParameterRecapTable parameterRecap={parameterRecap} />
                </div>

                {/* CONTENT */}
                <div className="mt-10">
                    <ReportsTable reports={reports} />
                </div>

                {/* TTD */}
                <div className="mt-20 flex justify-end">
                    <div className="text-center">
                        <p>Mengetahui,</p>

                        <p className="mt-20 font-semibold">
                            (............................)
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

<style>{`
@media print {
    .avoid-break {
        page-break-inside: avoid;
    }
}
`}</style>;

PrintRecap.layout = undefined;