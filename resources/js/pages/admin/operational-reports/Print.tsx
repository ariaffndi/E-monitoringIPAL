import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

type Props = {
    report: any;
};

export default function PrintOperationalReport({ report }: Props) {
    useEffect(() => {
        setTimeout(() => {
            window.print();
        }, 500);
    }, []);

    const reportNumber = `LAP-IPAL/${String(report.id).padStart(4, '0')}/${new Date(report.created_at).getFullYear()}`;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title="Cetak Laporan Operasional" />

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
                    {/* ================= TITLE ================= */}
                    <div className="mt-8 text-center">
                        <h2 className="text-xl font-bold uppercase">
                            Laporan Operasional IPAL
                        </h2>

                        <p className="mt-2 text-sm">Nomor: {reportNumber}</p>

                        <p className="mt-1 text-sm">
                            Project:
                            <span className="font-semibold">
                                {' '}
                                {report.project?.name}
                            </span>
                        </p>
                    </div>

                    {/* ================= INFO ================= */}
                    <div className="section grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p>
                                <span className="font-semibold">
                                    Hari/Tanggal:
                                </span>{' '}
                                {formatDate(report.created_at)}
                            </p>

                            <p>
                                <span className="font-semibold">Operator:</span>{' '}
                                {report.user?.name}
                            </p>
                        </div>

                        <div className="text-right">
                            <p>
                                <span className="font-semibold">
                                    Waktu Input:
                                </span>{' '}
                                {new Date(report.created_at).toLocaleTimeString(
                                    'id-ID',
                                )}
                            </p>
                        </div>
                    </div>

                    {/* ================= UNIT ================= */}
                    <div className="section avoid-break">
                        <p className="text-md mb-3 font-bold">
                            Kondisi Unit IPAL
                        </p>

                        <table className="w-full border-collapse border text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">No</th>
                                    <th className="border p-2">Unit</th>
                                    <th className="border p-2">Kondisi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {report.unit_tests.map(
                                    (item: any, index: number) => (
                                        <tr key={item.id}>
                                            <td className="border p-2 text-center">
                                                {index + 1}
                                            </td>

                                            <td className="border p-2">
                                                {item.unit?.name}
                                            </td>

                                            <td className="border p-2 text-center capitalize">
                                                {item.condition}
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ================= WATER TEST ================= */}
                    <div className="section report-table">
                        <p className="text-md mb-3 font-bold">
                            Hasil Kualitas Air
                        </p>

                        <table className="w-full border-collapse border text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">No</th>
                                    <th className="border p-2">Parameter</th>
                                    <th className="border p-2">Inlet</th>
                                    <th className="border p-2">Outlet</th>
                                </tr>
                            </thead>

                            <tbody>
                                {report.water_tests
                                    .filter((x: any) => x.location === 'inlet')
                                    .map((inlet: any, index: number) => {
                                        const outlet = report.water_tests.find(
                                            (x: any) =>
                                                x.location === 'outlet' &&
                                                x.water_parameter_id ===
                                                    inlet.water_parameter_id,
                                        );

                                        return (
                                            <tr key={inlet.id}>
                                                <td className="border p-2 text-center">
                                                    {index + 1}
                                                </td>

                                                <td className="border p-2">
                                                    {
                                                        inlet.water_parameter
                                                            ?.name
                                                    }
                                                </td>

                                                <td className="border p-2 text-center">
                                                    {inlet.value}
                                                </td>

                                                <td className="border p-2 text-center">
                                                    {outlet?.value ?? '-'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>

                    {/* ================= NOTES ================= */}
                    <div className="section">
                        <p className="text-md mb-3 font-bold">
                            Catatan Operasional
                        </p>

                        <div className="min-h-25 rounded border p-4 text-sm">
                            {report.note || '-'}
                        </div>
                    </div>

                    {/* ================= SIGNATURE ================= */}
                    <div className="signature mx-12 mt-24 flex justify-end">
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
                                (
                                {report.user?.name ||
                                    '............................'}
                                )
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

PrintOperationalReport.layout = undefined;
