import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

// import ComplianceChart from '@/components/operational-reports/CompilanceChart';

import ParameterRecapTable from '@/components/operational-reports/ParameterRecapTable';
import ReportsTable from '@/components/operational-reports/ReportsTable';
import UnitRecapTable from '@/components/operational-reports/UnitRecapTable';

type ChartItem = {
    date: string;
    compliance: number;
};

type Props = {
    project: {
        name: string;
    };
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
    project,
    reports,
    from,
    to,
    // chartData,
    unitRecap,
    parameterRecap,
}: Props) {
    useEffect(() => {
        setTimeout(() => {
            window.print();
        }, 500);
    }, []);

    return (
        <>
            <Head title="Print Rekap Laporan" />

            <div className="print-page">
                {/* WATERMARK SEMUA HALAMAN */}
                <div className="print-fixed">
                    <img
                        src="/images/print-watermark.png"
                        alt="background"
                        className="print-bg"
                    />
                </div>

                {/* KOP KHUSUS HALAMAN PERTAMA */}
                <div className="first-page-header">
                    <img
                        src="/images/print-header.png"
                        alt="header"
                        className="first-page-header-img"
                    />
                </div>

                {/* CONTENT */}
                <div className="print-content text-black">
                    {/* TITLE */}
                    <div className="mt-8 text-center">
                        <h2 className="text-xl font-bold uppercase">
                            Rekap Laporan Operasional IPAL
                        </h2>
                        <p className='font-semibold'>
                            {project?.name}
                        </p>

                        <p className="text-sm">
                            Periode {from} s/d {to}
                        </p>
                    </div>

                    <div className="section">
                        <p className="text-md mb-3 font-bold">
                            Rekap Kondisi Unit IPAL
                        </p>

                        <UnitRecapTable unitRecap={unitRecap} />
                    </div>

                    <div className="section">
                        <p className="text-md mb-3 font-bold">
                            Rekap Parameter Air
                        </p>

                        <ParameterRecapTable parameterRecap={parameterRecap} />
                    </div>

                    <br />
                    <br />
                    <br />

                    <div className="section">
                        <p className="text-md mb-3 font-bold">
                            Rekap Laporan Operasional
                        </p>

                        <ReportsTable reports={reports} />
                    </div>

                    <div className="signature mx-12 mt-24 flex justify-between">
                        <div className="text-center">
                            <p>
                                Surabaya,{' '}
                                {new Date().toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>

                            <p className="text-md">Operator</p>

                            <p className="mt-20 font-semibold">
                                (............................)
                            </p>
                        </div>

                        <div className="text-center">
                            <p>Mengetahui,</p>

                            <p className="text-md">Manajemen</p>

                            <p className="mt-20 font-semibold">
                                (............................)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

PrintRecap.layout = undefined;
