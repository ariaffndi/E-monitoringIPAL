import { Head } from '@inertiajs/react';

type Report = {
    id: number;
    note: string;
    created_at: string;
    user: {
        name: string;
    };
    unit_tests: any[];
    water_tests: any[];
};

export default function Show({ report }: { report: Report }) {
    // helper format tanggal
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // helper badge warna kondisi
    const getConditionColor = (condition: string) => {
        switch (condition?.toLowerCase()) {
            case 'sangat baik':
                return 'bg-green-100 text-green-700';
            case 'baik':
                return 'bg-blue-100 text-blue-700';
            case 'cukup':
                return 'bg-yellow-100 text-yellow-700';
            case 'kurang':
                return 'bg-orange-100 text-orange-700';
            case 'sangat kurang':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // split water test
    const inlet = report.water_tests.filter((w) => w.location === 'inlet');
    const outlet = report.water_tests.filter((w) => w.location === 'outlet');

    return (
        <>
            <Head title="Detail Laporan Operasional" />

            <div className="space-y-6 p-6">
                {/* HEADER */}
                <div className="rounded-lg border p-4 shadow-sm">
                    <h1 className="mb-2 text-lg font-bold">
                        Detail Laporan Operasional
                    </h1>

                    <p>
                        <b>Tanggal:</b> {formatDate(report.created_at)}
                    </p>
                    <p>
                        <b>Operator:</b> {report.user?.name}
                    </p>
                    <p>
                        <b>Catatan:</b> {report.note || '-'}
                    </p>
                </div>

                {/* UNIT TEST */}
                <div>
                    <h2 className="text-md mb-3 font-semibold">Unit Test</h2>

                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {report.unit_tests.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-lg border p-4 shadow-sm"
                            >
                                <p className="font-semibold">
                                    {item.unit?.name}
                                </p>

                                <span
                                    className={`mt-1 inline-block rounded px-2 py-1 text-xs ${getConditionColor(
                                        item.condition,
                                    )}`}
                                >
                                    {item.condition}
                                </span>

                                {item.test_image && (
                                    <img
                                        src={`/storage/${item.test_image}`}
                                        className="mt-3 h-24 w-24 rounded object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* WATER TEST */}
                <div>
                    <h2 className="text-md mb-3 font-semibold">Water Test</h2>

                    {/* INLET */}
                    <div className="mb-6">
                        <h3 className="mb-2 font-medium text-blue-600">
                            Inlet
                        </h3>

                        <div className="overflow-x-auto rounded border">
                            <table className="min-w-full text-center text-sm">
                                <thead className="bg-secondary">
                                    <tr>
                                        <th className="p-2">Parameter</th>
                                        <th className="p-2">Value</th>
                                        <th className="p-2">Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inlet.map((item) => (
                                        <tr key={item.id}>
                                            <td className="p-2">
                                                {item.water_parameter?.name}
                                            </td>
                                            <td className="p-2">
                                                {item.value}
                                            </td>
                                            <td className="p-2">
                                                {item.test_image && (
                                                    <img
                                                        src={`/storage/${item.test_image}`}
                                                        className="mx-auto h-16 w-16 rounded object-cover"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* OUTLET */}
                    <div>
                        <h3 className="mb-2 font-medium text-green-600">
                            Outlet
                        </h3>

                        <div className="overflow-x-auto rounded border">
                            <table className="min-w-full text-center text-sm">
                                <thead className="bg-secondary">
                                    <tr>
                                        <th className="p-2">Parameter</th>
                                        <th className="p-2">Value</th>
                                        <th className="p-2">Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {outlet.map((item) => (
                                        <tr key={item.id}>
                                            <td className="p-2">
                                                {item.water_parameter?.name}
                                            </td>
                                            <td className="p-2">
                                                {item.value}
                                            </td>
                                            <td className="p-2">
                                                {item.test_image && (
                                                    <img
                                                        src={`/storage/${item.test_image}`}
                                                        className="mx-auto h-16 w-16 rounded object-cover"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Detail Laporan Operasional',
        },
    ],
};

