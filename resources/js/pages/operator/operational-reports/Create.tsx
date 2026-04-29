import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// types
type Unit = {
    id: number;
    name: string;
};

type Parameter = {
    id: number;
    name: string;
    unit: string;
    type: string;
};

type UnitTest = {
    unit_id: number;
    unit_name: string;
    condition: string;
    test_image: File | null;
};

type WaterTest = {
    water_parameter_id: number;
    name: string;
    unit: string;
    type: string;
    value: string;
    test_image: File | null;
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
        })),
        water_tests: {
            inlet: parameters.map((param) => ({
                water_parameter_id: param.id,
                name: param.name,
                unit: param.unit,
                type: param.type,
                value: '',
                test_image: null,
            })),
            outlet: parameters.map((param) => ({
                water_parameter_id: param.id,
                name: param.name,
                unit: param.unit,
                type: param.type,
                value: '',
                test_image: null,
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
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">
                            {item.name} ({item.unit})
                        </td>
                        <td className="p-2">{item.value || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <>
            <Head title="Input Laporan Operasional" />

            <div className="space-y-6 p-6">
                <Progress value={(step / 3) * 100} className="h-2" />
                {/* steps */}
                <div className="flex items-center gap-2 text-xs md:text-sm">
                    {[
                        { stepNum: 1, label: 'Kondisi Unit' },
                        { stepNum: 2, label: 'Parameter Air' },
                        { stepNum: 3, label: 'Preview' },
                    ].map((s, i) => (
                        <div
                            key={s.stepNum}
                            className="flex items-center gap-2"
                        >
                            <span
                                className={`rounded-full px-3 py-1 text-xs ${
                                    step === s.stepNum
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-muted text-gray-600'
                                }`}
                            >
                                {s.stepNum}. {s.label}
                            </span>

                            {i < 2 && <span>→</span>}
                        </div>
                    ))}
                </div>

                {/* step 1 */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="font-semibold">Unit Test</h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {form.unit_tests.map((item, index) => (
                                <div
                                    key={index}
                                    className="w-full space-y-4 rounded border p-4 md:p-6"
                                >
                                    <p className="font-medium">
                                        {item.unit_name}
                                    </p>

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
                                            className={`${
                                                item.condition
                                                    ? getConditionColor(
                                                          item.condition,
                                                      )
                                                    : ''
                                            } cursor-pointer`}
                                        >
                                            <SelectValue placeholder="Kondisi Unit" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem
                                                className="cursor-pointer"
                                                value="sangat baik"
                                            >
                                                Sangat Baik
                                            </SelectItem>
                                            <SelectItem
                                                className="cursor-pointer"
                                                value="baik"
                                            >
                                                Baik
                                            </SelectItem>
                                            <SelectItem
                                                className="cursor-pointer"
                                                value="cukup"
                                            >
                                                Cukup
                                            </SelectItem>
                                            <SelectItem
                                                className="cursor-pointer"
                                                value="kurang"
                                            >
                                                Kurang
                                            </SelectItem>
                                            <SelectItem
                                                className="cursor-pointer"
                                                value="sangat kurang"
                                            >
                                                Sangat Kurang
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        type="file"
                                        className="w-full cursor-pointer"
                                        onChange={(e) =>
                                            handleUnitChange(
                                                index,
                                                'test_image',
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <Button
                                className="cursor-pointer"
                                onClick={() => {
                                    if (validateStep()) {
                                        setStep(2);
                                    }
                                }}
                            >
                                Next
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
                                Next
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

                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    {form.unit_tests.map((item, i) => (
                                        <div
                                            key={i}
                                            className="space-y-2 rounded border p-3 text-center"
                                        >
                                            <p className="font-medium">
                                                {item.unit_name}
                                            </p>

                                            <span
                                                className={`inline-block rounded px-2 py-1 text-xs ${getConditionColor(
                                                    item.condition,
                                                )}`}
                                            >
                                                {item.condition || '-'}
                                            </span>

                                            {/* PREVIEW IMAGE */}
                                            {item.test_image ? (
                                                <img
                                                    src={URL.createObjectURL(
                                                        item.test_image,
                                                    )}
                                                    alt={item.unit_name}
                                                    className="mx-auto mt-2 h-24 w-24 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="mx-auto mt-2 flex h-24 w-24 items-center justify-center rounded bg-muted text-xs text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
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
            title: 'Input Laporan Operasional',
        },
    ],
};
