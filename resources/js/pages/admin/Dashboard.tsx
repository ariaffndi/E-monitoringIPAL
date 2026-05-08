import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

export default function Dashboard() {
    // ================= DUMMY DATA =================
    const dummyUnits = [
        { id: 1, name: 'Bak Ekualisasi', condition: 'Baik' },
        { id: 2, name: 'Bak Aerasi', condition: 'Sangat Baik' },
        { id: 3, name: 'Clarifier', condition: 'Cukup' },
        { id: 4, name: 'Filter', condition: 'Kurang' },
        { id: 5, name: 'Disinfeksi', condition: 'Baik' },
    ];

    const dummyOperators = [
        { id: 1, name: 'Ari Affandi' },
        { id: 2, name: 'Budi Santoso' },
        { id: 3, name: 'Andi Saputra' },
    ];

    const dummyNotes = [
        {
            id: 1,
            note: 'Kondisi aerasi cukup stabil hari ini.',
        },
        {
            id: 2,
            note: 'Perlu pengecekan filter outlet.',
        },
    ];

    // ================= BADGE COLOR =================
    const getConditionBadge = (condition: string) => {
        switch (condition.toLowerCase()) {
            case 'sangat baik':
                return 'bg-green-100 text-green-700';
            case 'baik':
                return 'bg-blue-100 text-blue-700';
            case 'cukup':
                return 'bg-yellow-100 text-yellow-700';
            case 'kurang':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <>
            <Head title="Dashboard Admin" />

            {/* ================= MAIN LAYOUT ================= */}
            <div className="grid gap-4 p-4 lg:grid-cols-10">
                {/* ================= LEFT SIDE ================= */}
                <div className="min-w-0 space-y-4 lg:col-span-7">
                    {/* ================= UNIT ================= */}
                    <Card>
                        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle>Kondisi Unit IPAL</CardTitle>

                            <Button
                                size="sm"
                                variant="outline"
                                className="cursor-pointer text-xs"
                                onClick={() => router.visit('/units')}
                            >
                                Lihat Unit
                            </Button>
                        </CardHeader>

                        <CardContent>
                            <ScrollArea className="w-full whitespace-nowrap">
                                <div className="flex gap-4 pb-3">
                                    {dummyUnits.map((unit) => (
                                        <div
                                            key={unit.id}
                                            className="min-w-[170px] rounded-xl border bg-muted/30 p-4"
                                        >
                                            <p className="mb-3 line-clamp-2 font-semibold">
                                                {unit.name}
                                            </p>

                                            <Badge
                                                className={getConditionBadge(
                                                    unit.condition,
                                                )}
                                            >
                                                {unit.condition}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>

                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* ================= CHART ================= */}
                    <Card>
                        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle>Water Test</CardTitle>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                {/* LEGEND */}
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-sm bg-yellow-400" />
                                        <span>Inlet</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-sm bg-green-500" />
                                        <span>Outlet</span>
                                    </div>
                                </div>

                                {/* SELECT PARAMETER */}
                                <Select>
                                    <SelectTrigger className="w-full sm:w-[140px]">
                                        <SelectValue placeholder="Parameter" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="bod">BOD</SelectItem>
                                        <SelectItem value="cod">COD</SelectItem>
                                        <SelectItem value="ph">pH</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed text-center text-sm text-muted-foreground sm:h-[280px]">
                                Chart Line Inlet & Outlet
                            </div>
                        </CardContent>
                    </Card>

                    {/* ================= NOTES ================= */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Catatan</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {dummyNotes.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-lg border p-3 text-sm"
                                >
                                    {item.note}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div className="flex min-w-0 flex-col gap-4 lg:col-span-3">
                    {/* ================= CALENDAR ================= */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kalender</CardTitle>
                        </CardHeader>

                        <CardContent className="flex justify-center">
                            {/* ❌ border dihapus */}
                            <Calendar
                                mode="single"
                                selected={new Date()}
                                className="w-full"
                            />
                        </CardContent>
                    </Card>

                    {/* ================= OPERATORS ================= */}
                    {/* ✅ flex-1 agar memenuhi sisa tinggi */}
                    <Card className="flex-1">
                        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle>Operator</CardTitle>

                            <Button
                                size="sm"
                                variant="outline"
                                className="cursor-pointer text-xs"
                                onClick={() => router.visit('/users')}
                            >
                                Lihat Semua
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {dummyOperators.map((operator) => (
                                <div
                                    key={operator.id}
                                    className="flex items-center gap-3 rounded-lg border p-3"
                                >
                                    <Avatar>
                                        <AvatarFallback>
                                            {operator.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">
                                            {operator.name}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            Operator IPAL
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
