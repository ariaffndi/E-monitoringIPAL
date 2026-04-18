import { Head, router } from '@inertiajs/react';
import { PlusCircle, Search, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

type Report = {
    id: number;
    note: string;
    created_at: string;
    user: {
        name: string;
    };
};

export default function OperationalReports({ reports }: { reports: Report[] }) {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    // 🔍 SEARCH
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        const delay = setTimeout(() => {
            router.get('/operational-reports', search ? { search } : {}, {
                preserveState: true,
                replace: true,
                onFinish: () => setLoading(false),
            });
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setSearch('');
            router.get('/operational-reports', {}, { preserveState: true });
        }
    };

    return (
        <>
            <Head title="Laporan Operasional" />

            <div className="flex flex-col gap-4 p-4">
                {/* HEADER */}
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <Button
                        className="mb-2 w-fit cursor-pointer bg-blue-600 hover:bg-blue-700 sm:mb-0"
                    >
                        <PlusCircle />
                        Tambah Laporan
                    </Button>

                    <div className="relative">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                            size={16}
                        />

                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pr-10 pl-10"
                        />

                        {loading && (
                            <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                <Spinner className="size-4" />
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                {/* TABLE */}
                <div className="w-full overflow-x-auto rounded-lg border">
                    <table className="table min-w-full text-center text-sm">
                        <thead>
                            <tr className="bg-secondary">
                                <th className="p-2">No</th>
                                <th className="p-2">Tanggal</th>
                                <th className="p-2">Operator</th>
                                <th className="p-2">Catatan</th>
                                <th className="p-2">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reports?.map((report, index) => (
                                <tr
                                    key={report.id}
                                    className="hover:bg-secondary"
                                >
                                    <td className="p-2">{index + 1}</td>

                                    <td className="p-2">
                                        {new Date(
                                            report.created_at,
                                        ).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </td>

                                    <td className="p-2">{report.user?.name}</td>

                                    <td className="max-w-50 truncate p-2">
                                        {report.note}
                                    </td>

                                    <td className="p-2">
                                        <div className="flex justify-center">
                                            <Button
                                                title="Detail"
                                                size="sm"
                                                onClick={() =>
                                                    router.visit(
                                                        `/operational-reports/${report.id}`,
                                                    )
                                                }
                                                className="cursor-pointer bg-sky-100 text-sky-700 hover:bg-sky-300"
                                            >
                                                <Info />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

OperationalReports.layout = {
    breadcrumbs: [
        {
            title: 'Laporan Operasional',
        },
    ],
};
