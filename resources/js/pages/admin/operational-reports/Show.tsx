import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type UnitTest = {
    id: number;
    condition: string;
    test_image?: string | null;

    unit?: {
        name: string;
    };
};

type WaterTest = {
    id: number;
    location: string;
    value: string;
    min_value?: number | null;
    max_value?: number | null;

    water_parameter?: {
        name: string;
        unit: string;
        type: string;
        min_value?: number | null;
        max_value?: number | null;
    };
};

type Report = {
    id: number;
    created_at: string;
    note: string;

    user?: {
        name: string;
    };

    unit_tests: UnitTest[];

    water_tests: WaterTest[];
};

export default function Show({ report }: { report: Report }) {
    const formatTanggal = (dateString: string) => {
        const date = new Date(dateString);

        const hari = date.toLocaleDateString('id-ID', {
            weekday: 'long',
        });

        const tanggal = date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        return `${hari}, ${tanggal.replace(/\//g, '-')}`;
    };

    const getConditionColor = (condition: string) => {
        switch (condition?.toLowerCase()) {
            case 'sangat baik':
                return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';

            case 'baik':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';

            case 'cukup':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';

            case 'kurang':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';

            case 'sangat kurang':
                return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';

            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getWaterStatus = (item: WaterTest) => {
        const value = Number(item.value);

        if (isNaN(value)) {
            return false;
        }

        const min = item.water_parameter?.min_value ?? item.min_value;

        const max = item.water_parameter?.max_value ?? item.max_value;

        const meetsMin =
            min === null || min === undefined ? true : value >= min;

        const meetsMax =
            max === null || max === undefined ? true : value <= max;

        return meetsMin && meetsMax;
    };

    const groupByType = (data: WaterTest[]) => {
        return {
            fisika: data.filter((d) => d.water_parameter?.type === 'fisika'),

            kimia: data.filter((d) => d.water_parameter?.type === 'kimia'),

            biologi: data.filter((d) => d.water_parameter?.type === 'biologi'),
        };
    };

    const inlet = report.water_tests.filter((w) => w.location === 'inlet');

    const outlet = report.water_tests.filter((w) => w.location === 'outlet');

    const renderPreviewTable = (data: WaterTest[]) => (
        <table className="min-w-full border text-center text-sm">
            <thead className="bg-secondary">
                <tr>
                    <th className="p-2">No</th>

                    <th className="p-2">Parameter</th>

                    <th className="p-2">Value</th>

                    <th className="p-2">Status</th>
                </tr>
            </thead>

            <tbody>
                {data.map((item, index) => {
                    const isMeet = getWaterStatus(item);

                    return (
                        <tr key={item.id}>
                            <td className="p-2">{index + 1}</td>

                            <td className="p-2">
                                {item.water_parameter?.name} (
                                {item.water_parameter?.unit})
                            </td>

                            <td className="p-2 font-medium">
                                {item.value || '-'}
                            </td>

                            <td className="p-2">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        isMeet
                                            ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                                            : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                                    }`}
                                >
                                    {isMeet ? 'Memenuhi' : 'Tidak Memenuhi'}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    return (
        <>
            <Head title="Detail Laporan Operasional" />

            <div className="space-y-6 p-6">
                {/* ================= HEADER ================= */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Operational Report Detail
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Detailed operational monitoring and water quality
                            reporting results from operators.
                        </p>
                    </div>

                    <Button
                        className="w-fit cursor-pointer bg-green-600 transition-transform duration-500 hover:scale-105 hover:bg-green-700"
                        onClick={() =>
                            window.open(
                                `/operational-reports/${report.id}/print`,
                                '_blank',
                            )
                        }
                    >
                        <Printer />
                        Cetak Detail Laporan
                    </Button>
                </div>

                <Separator />

                {/* ================= INFO ================= */}
                <div className="space-y-2 rounded-xl border bg-card p-4">
                    <p className="text-sm">
                        <span className="font-semibold">Tanggal:</span>{' '}
                        {formatTanggal(report.created_at)}
                    </p>

                    <p className="text-sm">
                        <span className="font-semibold">Operator:</span>{' '}
                        {report.user?.name || '-'}
                    </p>

                    <p className="text-sm">
                        <span className="font-semibold">Catatan:</span>{' '}
                        {report.note || '-'}
                    </p>
                </div>

                {/* ================= UNIT TEST ================= */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">
                            Kondisi Unit IPAL
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Hasil kondisi setiap unit IPAL beserta dokumentasi
                            pendukung.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {report.unit_tests.map((item) => (
                            <Card
                                key={item.id}
                                className="border-border/60 transition-all duration-300"
                            >
                                <CardHeader className="space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-base">
                                                {item.unit?.name ?? '-'}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-5">
                                    {/* CONDITION */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Kondisi Unit
                                        </label>

                                        <div
                                            className={`mt-2 flex w-full items-center rounded-md border px-4 py-3 text-sm font-medium capitalize ${getConditionColor(
                                                item.condition,
                                            )}`}
                                        >
                                            {item.condition || '-'}
                                        </div>
                                    </div>

                                    {/* IMAGE */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Dokumentasi
                                        </label>

                                        <div className="relative mt-2 flex aspect-3/1 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/20">
                                            {item.test_image ? (
                                                <img
                                                    src={`/storage/${item.test_image}`}
                                                    alt={
                                                        item.unit?.name ??
                                                        'Unit Image'
                                                    }
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="space-y-2 text-center">
                                                    <p className="text-sm font-medium">
                                                        No Image
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        Tidak ada dokumentasi
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* ================= WATER TEST ================= */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">
                            Water Test
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Hasil pengujian parameter air inlet dan outlet IPAL.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 md:flex-row">
                        {/* INLET */}
                        <div className="w-full space-y-4 md:w-1/2">
                            <div className="flex items-center justify-center">
                                <h3 className="font-semibold text-blue-600">
                                    Inlet
                                </h3>
                            </div>

                            {Object.entries(groupByType(inlet)).map(
                                ([type, data]) =>
                                    data.length > 0 && (
                                        <div key={type} className="space-y-2">
                                            <p className="font-medium capitalize">
                                                {type}
                                            </p>

                                            {renderPreviewTable(data)}
                                        </div>
                                    ),
                            )}
                        </div>

                        {/* SEPARATOR */}
                        <div className="hidden w-px bg-border md:block" />

                        {/* OUTLET */}
                        <div className="w-full space-y-4 md:w-1/2">
                            <div className="flex items-center justify-center">
                                <h3 className="font-semibold text-green-600">
                                    Outlet
                                </h3>
                            </div>

                            {Object.entries(groupByType(outlet)).map(
                                ([type, data]) =>
                                    data.length > 0 && (
                                        <div key={type} className="space-y-2">
                                            <p className="font-medium capitalize">
                                                {type}
                                            </p>

                                            {renderPreviewTable(data)}
                                        </div>
                                    ),
                            )}
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
            title: 'Home',
            href: '/dashboard',
        },
        {
            title: 'Laporan Operasional',
            href: '/operational-reports',
        },
        {
            title: 'Detail Laporan Operasional',
        },
    ],
};
