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

            <div className="mx-auto max-w-5xl bg-white p-10 text-black">
                {/* ================= HEADER ================= */}
                <div className="flex items-center gap-4 border-b-4 border-black pb-4">
                    <img src="/logo.png" className="h-20 w-20 object-contain" />

                    <div className="flex-1 text-center">
                        <h1 className="text-2xl font-bold">
                            PT MITRA PRIMA ENVIRO
                        </h1>

                        <p className="text-sm">
                            Jasa Konsultan Lingkungan & IPAL
                        </p>

                        <p className="text-xs">Surabaya, Jawa Timur</p>
                    </div>
                </div>

                {/* ================= TITLE ================= */}
                <div className="mt-8 text-center">
                    <h2 className="text-xl font-bold uppercase">
                        Laporan Operasional IPAL
                    </h2>

                    <p className="mt-2 text-sm">Nomor: {reportNumber}</p>
                </div>

                {/* ================= INFO ================= */}
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p>
                            <span className="font-semibold">Hari/Tanggal:</span>{' '}
                            {formatDate(report.created_at)}
                        </p>

                        <p>
                            <span className="font-semibold">Operator:</span>{' '}
                            {report.user?.name}
                        </p>
                    </div>

                    <div>
                        <p>
                            <span className="font-semibold">Waktu Input:</span>{' '}
                            {new Date(report.created_at).toLocaleTimeString(
                                'id-ID',
                            )}
                        </p>
                    </div>
                </div>

                {/* ================= UNIT ================= */}
                <div className="mt-10">
                    <h3 className="mb-3 text-lg font-bold">
                        Kondisi Unit IPAL
                    </h3>

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
                <div className="mt-10">
                    <h3 className="mb-3 text-lg font-bold">Hasil Water Test</h3>

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
                                                {inlet.water_parameter?.name}
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
                <div className="mt-10">
                    <h3 className="mb-3 text-lg font-bold">
                        Catatan Operasional
                    </h3>

                    <div className="min-h-[100px] rounded border p-4 text-sm">
                        {report.note || '-'}
                    </div>
                </div>

                {/* ================= SIGN ================= */}
                <div className="mt-20 flex justify-end">
                    <div className="text-center">
                        <p>Operator IPAL</p>

                        <div className="h-20" />

                        <p className="font-semibold underline">
                            {report.user?.name}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

PrintOperationalReport.layout = (page: React.ReactNode) => page;