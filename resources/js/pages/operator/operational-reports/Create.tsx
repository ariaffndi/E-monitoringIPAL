import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    // CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// types
type Unit = {
    id: number;
    name: string;
    // description: string;
};

type Parameter = {
    id: number;
    name: string;
    unit: string;
    type: string;
    min_value: number | null;
    max_value: number | null;
};

type UnitTest = {
    unit_id: number;
    unit_name: string;
    condition: string;
    test_image: File | null;
    // unit_description: string;
};

type WaterTest = {
    water_parameter_id: number;
    name: string;
    unit: string;
    type: string;
    value: string;
    min_value: number | null;
    max_value: number | null;
};

type FormType = {
    note: string;
    unit_tests: UnitTest[];
    water_tests: {
        inlet: WaterTest[];
        outlet: WaterTest[];
    };
};

type Props = {
    units: Unit[];
    parameters: Parameter[];
};

export default function Create({ units, parameters }: Props) {
    // states
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<FormType>(() => ({
        note: '',
        unit_tests: units.map((unit) => ({
            unit_id: unit.id,
            unit_name: unit.name,
            condition: '',
            test_image: null,
            // unit_description: unit.description,
        })),
        water_tests: {
            inlet: parameters.map((param) => ({
                water_parameter_id: param.id,
                name: param.name,
                unit: param.unit,
                type: param.type,
                value: '',
                min_value: param.min_value,
                max_value: param.max_value,
            })),
            outlet: parameters.map((param) => ({
                water_parameter_id: param.id,
                name: param.name,
                unit: param.unit,
                type: param.type,
                value: '',
                min_value: param.min_value,
                max_value: param.max_value,
            })),
        },
    }));

    // handlers
    const handleUnitChange = <K extends keyof UnitTest>(
        index: number,
        field: K,
        value: UnitTest[K],
    ) => {
        const updated = [...form.unit_tests];
        updated[index][field] = value;

        setForm({ ...form, unit_tests: updated });
    };

    const handleWaterChange = <K extends keyof WaterTest>(
        location: 'inlet' | 'outlet',
        index: number,
        field: K,
        value: WaterTest[K],
    ) => {
        const updated = [...form.water_tests[location]];
        updated[index][field] = value;

        setForm({
            ...form,
            water_tests: {
                ...form.water_tests,
                [location]: updated,
            },
        });
    };

    const handleSubmit = () => {
        router.post('/operational-reports', form, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Laporan berhasil disimpan');
            },
        });
    };

    const getConditionColor = (condition: string) => {
        switch (condition) {
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

    const getWaterStatus = (item: WaterTest) => {
        const value = Number(item.value);

        if (isNaN(value)) {
            return false;
        }

        const min = item.min_value;
        const max = item.max_value;

        const meetsMin = min === null || value >= min;
        const meetsMax = max === null || value <= max;

        return meetsMin && meetsMax;
    };

    const groupByType = (data: WaterTest[]) => {
        return {
            fisika: data.filter((d) => d.type === 'fisika'),
            kimia: data.filter((d) => d.type === 'kimia'),
            biologi: data.filter((d) => d.type === 'biologi'),
        };
    };

    const renderTable = (data: WaterTest[], location: 'inlet' | 'outlet') => (
        <table className="min-w-full border text-center text-sm">
            <thead className="bg-secondary">
                <tr>
                    <th className="p-2">No</th>
                    <th className="p-2">Parameter</th>
                    <th className="p-2">Value</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => {
                    const originalIndex = form.water_tests[location].findIndex(
                        (w) => w.water_parameter_id === item.water_parameter_id,
                    );

                    return (
                        <tr key={item.water_parameter_id}>
                            <td className="p-2">{originalIndex + 1}</td>

                            <td className="p-2">
                                {item.name} ({item.unit})
                            </td>

                            <td className="p-2">
                                <Input
                                    type="number"
                                    value={item.value}
                                    onChange={(e) =>
                                        handleWaterChange(
                                            location,
                                            originalIndex,
                                            'value',
                                            e.target.value,
                                        )
                                    }
                                    className="text-center"
                                />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    const validateStep = () => {
        if (step === 1) {
            const invalid = form.unit_tests.some((u) => !u.condition);

            if (invalid) {
                toast.error('Semua kondisi unit harus diisi');

                return false;
            }
        }

        if (step === 2) {
            const inletInvalid = form.water_tests.inlet.some((w) => !w.value);
            const outletInvalid = form.water_tests.outlet.some((w) => !w.value);

            if (inletInvalid || outletInvalid) {
                toast.error('Semua nilai water test harus diisi');

                return false;
            }
        }

        return true;
    };

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
                        <tr
                            key={index}>
                            <td className="p-2">{index + 1}</td>

                            <td className="p-2">
                                {item.name} ({item.unit})
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
            <Head title="Input Laporan Operasional" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Input Operational Report
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Fill out the daily operational status for IPAL units
                            and water parameters.
                        </p>
                    </div>
                </div>

                <Separator />

                {/* PROGRESS STEP */}
                <div className="mx-auto mb-10 max-w-2xl">
                    <div className="relative flex items-center justify-between">
                        {/* LINE */}
                        <div className="absolute top-5 left-0 h-1 w-full rounded-full bg-muted" />

                        <div
                            className="absolute top-5 left-0 h-1 rounded-full bg-blue-200 transition-all duration-300"
                            style={{
                                width:
                                    step === 1
                                        ? '0%'
                                        : step === 2
                                          ? '50%'
                                          : '100%',
                            }}
                        />

                        {[
                            { number: 1, label: 'Kondisi Unit' },
                            { number: 2, label: 'Parameter Air' },
                            { number: 3, label: 'Preview' },
                        ].map((item) => {
                            const isActive = step === item.number;
                            const isCompleted = step > item.number;

                            return (
                                <div
                                    key={item.number}
                                    className="relative z-10 flex flex-col items-center gap-2"
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-4 text-sm font-semibold transition-all ${
                                            isCompleted
                                                ? 'border-blue-500 bg-blue-500 text-white'
                                                : isActive
                                                  ? 'border-blue-500 bg-background text-blue-500'
                                                  : 'border-muted bg-background text-muted-foreground'
                                        }`}
                                    >
                                        {isCompleted ? '✓' : item.number}
                                    </div>

                                    <span
                                        className={`text-xs font-medium md:text-sm ${
                                            isCompleted || isActive
                                                ? 'text-blue-500'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">
                                Kondisi Unit IPAL
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Input kondisi setiap unit IPAL beserta
                                dokumentasi pendukung.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {form.unit_tests.map((item, index) => (
                                <Card
                                    key={index}
                                    className="border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <CardHeader className="space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <CardTitle className="text-base">
                                                    {item.unit_name}
                                                </CardTitle>

                                                {/* <CardDescription className="mt-1">
                                                    {item.unit_description}
                                                </CardDescription> */}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-5">
                                        {/* CONDITION */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Kondisi Unit
                                            </label>
                                            <Select
                                                value={item.condition}
                                                onValueChange={(value) =>
                                                    handleUnitChange(
                                                        index,
                                                        'condition',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    className={`mt-2 w-full cursor-pointer p-4 transition-colors ${
                                                        item.condition
                                                            ? getConditionColor(
                                                                  item.condition,
                                                              )
                                                            : ''
                                                    }`}
                                                >
                                                    <SelectValue placeholder="Pilih kondisi unit" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem
                                                        value="sangat baik"
                                                        className="cursor-pointer"
                                                    >
                                                        Sangat Baik
                                                    </SelectItem>

                                                    <SelectItem
                                                        value="baik"
                                                        className="cursor-pointer"
                                                    >
                                                        Baik
                                                    </SelectItem>

                                                    <SelectItem
                                                        value="cukup"
                                                        className="cursor-pointer"
                                                    >
                                                        Cukup
                                                    </SelectItem>

                                                    <SelectItem
                                                        value="kurang"
                                                        className="cursor-pointer"
                                                    >
                                                        Kurang
                                                    </SelectItem>

                                                    <SelectItem
                                                        value="sangat kurang"
                                                        className="cursor-pointer"
                                                    >
                                                        Sangat Kurang
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* IMAGE */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Dokumentasi
                                            </label>

                                            <label className="relative mt-2 flex aspect-3/1 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/20 transition-colors hover:border-primary/40 hover:bg-muted/30">
                                                <Input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleUnitChange(
                                                            index,
                                                            'test_image',
                                                            e.target
                                                                .files?.[0] ??
                                                                null,
                                                        )
                                                    }
                                                />

                                                {item.test_image ? (
                                                    <>
                                                        {/* PREVIEW IMAGE */}
                                                        <img
                                                            src={URL.createObjectURL(
                                                                item.test_image,
                                                            )}
                                                            alt={item.unit_name}
                                                            className="absolute inset-0 h-full w-full object-cover"
                                                        />

                                                        {/* OVERLAY */}
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                                                            <p className="text-sm font-medium text-white">
                                                                Ganti Gambar
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="space-y-2 text-center">
                                                        <p className="text-sm font-medium">
                                                            Upload Dokumentasi
                                                        </p>

                                                        <p className="text-xs text-muted-foreground">
                                                            JPG, PNG, atau JPEG
                                                        </p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <Button
                                size="lg"
                                className="cursor-pointer px-8"
                                onClick={() => {
                                    if (validateStep()) {
                                        setStep(2);
                                    }
                                }}
                            >
                                Next Step
                            </Button>
                        </div>
                    </div>
                )}

                {/* step 2 */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="font-semibold">Water Test</h2>

                        <div className="flex flex-col gap-6 md:flex-row">
                            {/* INLET */}
                            <div className="w-full space-y-4 md:w-1/2">
                                <h3 className="font-semibold text-blue-600">
                                    Inlet
                                </h3>

                                {Object.entries(
                                    groupByType(form.water_tests.inlet),
                                ).map(([type, data]) => (
                                    <div key={type}>
                                        <p className="mb-1 font-medium capitalize">
                                            {type}
                                        </p>
                                        {renderTable(data, 'inlet')}
                                    </div>
                                ))}
                            </div>

                            {/* SEPARATOR */}
                            <div className="hidden w-px bg-border md:block" />

                            {/* OUTLET */}
                            <div className="w-full space-y-4 md:w-1/2">
                                <h3 className="font-semibold text-green-600">
                                    Outlet
                                </h3>

                                {Object.entries(
                                    groupByType(form.water_tests.outlet),
                                ).map(([type, data]) => (
                                    <div key={type}>
                                        <p className="mb-1 font-medium capitalize">
                                            {type}
                                        </p>
                                        {renderTable(data, 'outlet')}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Button
                                className="cursor-pointer"
                                variant="secondary"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </Button>

                            <Button
                                className="cursor-pointer"
                                onClick={() => {
                                    if (validateStep()) {
                                        setStep(3);
                                    }
                                }}
                            >
                                Next Step
                            </Button>
                        </div>
                    </div>
                )}

                {/* step 3 */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="font-semibold">Preview</h2>

                        <div className="space-y-6">
                            {/* UNIT */}
                            <div className="my-8">
                                <h3 className="font-semibold">Unit Test</h3>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                    {form.unit_tests.map((item, index) => (
                                        <Card
                                            key={index}
                                            className="border-border/60 transition-all duration-300"
                                        >
                                            <CardHeader className="space-y-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <CardTitle className="text-base">
                                                            {item.unit_name}
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
                                                        className={`mt-2 flex w-full items-center rounded-md border px-4 py-3 text-sm font-medium ${getConditionColor(
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
                                                                src={URL.createObjectURL(
                                                                    item.test_image,
                                                                )}
                                                                alt={
                                                                    item.unit_name
                                                                }
                                                                className="absolute inset-0 h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="space-y-2 text-center">
                                                                <p className="text-sm font-medium">
                                                                    No Image
                                                                </p>

                                                                <p className="text-xs text-muted-foreground">
                                                                    Tidak ada
                                                                    dokumentasi
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

                            {/* WATER */}
                            <div className="my-8">
                                <h3 className="font-semibold">Water Test</h3>
                                <div className="flex flex-col gap-6 md:flex-row">
                                    {/* INLET */}
                                    <div className="w-full space-y-4 md:w-1/2">
                                        <div className="flex items-center justify-center">
                                            <h3 className="font-semibold text-blue-600">
                                                Inlet
                                            </h3>
                                        </div>

                                        {Object.entries(
                                            groupByType(form.water_tests.inlet),
                                        ).map(([type, data]) => (
                                            <div key={type}>
                                                <p className="mb-1 font-medium capitalize">
                                                    {type}
                                                </p>
                                                {renderPreviewTable(data)}
                                            </div>
                                        ))}
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

                                        {Object.entries(
                                            groupByType(
                                                form.water_tests.outlet,
                                            ),
                                        ).map(([type, data]) => (
                                            <div key={type}>
                                                <p className="mb-1 font-medium capitalize">
                                                    {type}
                                                </p>
                                                {renderPreviewTable(data)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* CATATAN */}
                            <div className="my-8 space-y-2">
                                <h3 className="font-semibold">
                                    Catatan Operasional
                                </h3>

                                <textarea
                                    value={form.note}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            note: e.target.value,
                                        })
                                    }
                                    placeholder="Masukkan catatan operasional..."
                                    className="min-h-30 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Button
                                className="cursor-pointer"
                                variant="secondary"
                                onClick={() => setStep(2)}
                            >
                                Back
                            </Button>

                            <Button
                                className="cursor-pointer"
                                onClick={handleSubmit}
                            >
                                Submit Laporan
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Home',
            href: '/dashboard',
        },
        {
            title: 'Input Laporan Operasional',
        },
    ],
};
