import { Head } from '@inertiajs/react';
import { Printer, MoreVertical } from 'lucide-react';
import { Image } from 'lucide-react';
import { useState } from 'react';
import ModalDetail from '@/components/modal-detail';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

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
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    // helper format tanggal
    const formatDate = (dateString: string) => {
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

    const handleView = (image: string | null) => {
        if (!image) {
            return;
        }

        setSelectedImage(image);
        setOpenDetail(true);
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

    
    const inlet = report.water_tests.filter((w) => w.location === 'inlet');
    const outlet = report.water_tests.filter((w) => w.location === 'outlet');
    const groupByType = (data: any[]) => {
        return {
            fisika: data.filter(
                (item) => item.water_parameter?.type === 'fisika',
            ),
            kimia: data.filter(
                (item) => item.water_parameter?.type === 'kimia',
            ),
            biologi: data.filter(
                (item) => item.water_parameter?.type === 'biologi',
            ),
        };
    };

    const inletGrouped = groupByType(inlet);
    const outletGrouped = groupByType(outlet);

    const getValueColor = (value: number, min: number, max: number) => {
        if (value >= min && value <= max) {
            return 'bg-green-100 text-green-700';
        }

        // hitung seberapa jauh dari range
        let deviation = 0;

        if (value < min) {
            deviation = (min - value) / min;
        } else if (value > max) {
            deviation = (value - max) / max;
        }

        // clamp biar ga berlebihan
        deviation = Math.min(deviation, 1);

        if (deviation < 0.2) {
            return 'bg-yellow-100 text-yellow-700';
        } else if (deviation < 0.5) {
            return 'bg-orange-100 text-orange-700';
        } else {
            return 'bg-red-100 text-red-700';
        }
    };

    const renderTable = (title: string, data: any[]) => {
        if (!data.length) {
            return null;
        }

        return (
            <div className="mb-4">
                <p className="mb-2 text-sm font-semibold text-gray-600 capitalize">
                    {title}
                </p>

                <div className="overflow-hidden rounded border">
                    <table className="min-w-full text-center text-sm">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="w-12 p-2">No</th>
                                <th className="p-2">Parameter</th>
                                <th className="p-2">Nilai</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">
                                        {item.water_parameter?.name}
                                    </td>
                                    <td className="p-2">
                                        <span
                                            className={`rounded px-2 py-1 text-xs ${getValueColor(
                                                Number(item.value),
                                                Number(
                                                    item.water_parameter
                                                        ?.min_value,
                                                ),
                                                Number(
                                                    item.water_parameter
                                                        ?.max_value,
                                                ),
                                            )}`}
                                        >
                                            {item.value}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };




    return (
        <>
            <Head title="Detail Laporan Operasional" />

            <div className="flex flex-col gap-4 p-4">
                {/* HEADER */}
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <div className="">
                        <p className="font-semibold">
                            {formatDate(report.created_at)}
                        </p>
                        <p className="text-sm text-gray-800">
                            {report.user?.name}
                        </p>
                        <p className="text-sm">
                            Catatan: <br />{' '}
                            <p className="text-sm text-gray-500">
                                {report.note || '-'}
                            </p>
                        </p>
                    </div>

                    <Button
                        className="mb-2 w-fit cursor-pointer bg-green-600 hover:bg-green-700 sm:mb-0"
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

                <div className="w-full overflow-x-auto rounded-lg border">
                    <div className="space-y-6 p-6">
                        {/* UNIT TEST */}
                        <div className="mb-6">
                            <h2 className="text-md mb-3 font-semibold">
                                Keadaan Unit IPAL
                            </h2>

                            <div className="mt-4 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                                {report.unit_tests.map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative rounded-xl border p-4 shadow-sm transition hover:shadow-md"
                                    >
                                        {/* DROPDOWN */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="absolute top-2 right-2 cursor-pointer"
                                                >
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        handleView(
                                                            item.test_image,
                                                        );
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    <Image size={16} />
                                                    Lihat Gambar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        {/* CONTENT */}
                                        <div className="flex items-center gap-3">
                                            {/* INFO */}
                                            <div>
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
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className="mt-10" />

                        {/* WATER TEST */}
                        <div>
                            <h2 className="text-md mb-3 font-semibold">
                                Baku Mutu Air
                            </h2>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* INLET */}
                                <div>
                                    <h3 className="mb-3 text-center text-lg font-semibold text-blue-600">
                                        Inlet
                                    </h3>

                                    {renderTable('Fisika', inletGrouped.fisika)}
                                    {renderTable('Kimia', inletGrouped.kimia)}
                                    {renderTable(
                                        'Biologi',
                                        inletGrouped.biologi,
                                    )}
                                </div>

                                {/* OUTLET */}
                                <div className="lg:border-l lg:pl-6">
                                    <h3 className="mb-3 text-center text-lg font-semibold text-green-600">
                                        Outlet
                                    </h3>

                                    {renderTable(
                                        'Fisika',
                                        outletGrouped.fisika,
                                    )}
                                    {renderTable('Kimia', outletGrouped.kimia)}
                                    {renderTable(
                                        'Biologi',
                                        outletGrouped.biologi,
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalDetail
                open={openDetail}
                setOpen={setOpenDetail}
                title="Gambar Unit"
            >
                {selectedImage ? (
                    <div className="flex justify-center">
                        <img
                            src={`/storage/${selectedImage}`}
                            className="max-h-100 w-auto rounded-lg object-contain"
                        />
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-500">
                        Tidak ada gambar
                    </p>
                )}
            </ModalDetail>
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
