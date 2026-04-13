import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

/* ================= TYPES ================= */

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

/* ================= COMPONENT ================= */

export default function Create({ units, parameters }: Props) {
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

    /* ================= HANDLER ================= */

    const handleUnitChange = (
        index: number,
        field: keyof UnitTest,
        value: any,
    ) => {
        const updated = [...form.unit_tests];
        updated[index][field] = value;

        setForm({ ...form, unit_tests: updated });
    };

    const handleWaterChange = (
        location: 'inlet' | 'outlet',
        index: number,
        field: keyof WaterTest,
        value: any,
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

    /* ================= UI ================= */

    return (
        <>
            <Head title="Input Laporan Operasional" />

            <div className="space-y-6 p-6">
                <h1 className="text-xl font-bold">Input Laporan Operasional</h1>

                {/* STEP INDICATOR */}
                <div className="flex gap-2">
                    <span className={step === 1 ? 'font-bold' : ''}>
                        1. Unit
                    </span>
                    <span>→</span>
                    <span className={step === 2 ? 'font-bold' : ''}>
                        2. Water
                    </span>
                    <span>→</span>
                    <span className={step === 3 ? 'font-bold' : ''}>
                        3. Preview
                    </span>
                </div>

                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="font-semibold">Unit Test</h2>

                        {form.unit_tests.map((item, index) => (
                            <div
                                key={index}
                                className="space-y-2 rounded border p-4"
                            >
                                <p className="font-medium">{item.unit_name}</p>

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
                                    <SelectTrigger>
                                        <SelectValue placeholder="Kondisi Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="sangat baik">
                                                Sangat Baik
                                            </SelectItem>
                                            <SelectItem value="baik">
                                                Baik
                                            </SelectItem>
                                            <SelectItem value="cukup">
                                                Cukup
                                            </SelectItem>
                                            <SelectItem value="kurang">
                                                Kurang
                                            </SelectItem>
                                            <SelectItem value="sangat kurang">
                                                Sangat Kurang
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Input
                                    type="file"
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

                        <div className="flex justify-end">
                            <Button onClick={() => setStep(2)}>Next</Button>
                        </div>
                    </div>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="font-semibold">Water Test</h2>

                        {/* INLET */}
                        <div>
                            <h3 className="mb-2 font-semibold">Inlet</h3>

                            {form.water_tests.inlet.map((item, index) => (
                                <div
                                    key={index}
                                    className="space-y-2 rounded border p-4"
                                >
                                    <p className="font-medium">
                                        {item.name} ({item.unit}) - {item.type}
                                    </p>

                                    <Input
                                        placeholder="Value"
                                        value={item.value}
                                        onChange={(e) =>
                                            handleWaterChange(
                                                'inlet',
                                                index,
                                                'value',
                                                e.target.value,
                                            )
                                        }
                                    />

                                    <Input
                                        type="file"
                                        onChange={(e) =>
                                            handleWaterChange(
                                                'inlet',
                                                index,
                                                'test_image',
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        {/* OUTLET */}
                        <div>
                            <h3 className="mb-2 font-semibold">Outlet</h3>

                            {form.water_tests.outlet.map((item, index) => (
                                <div
                                    key={index}
                                    className="space-y-2 rounded border p-4"
                                >
                                    <p className="font-medium">
                                        {item.name} ({item.unit}) - {item.type}
                                    </p>

                                    <Input
                                        placeholder="Value"
                                        value={item.value}
                                        onChange={(e) =>
                                            handleWaterChange(
                                                'outlet',
                                                index,
                                                'value',
                                                e.target.value,
                                            )
                                        }
                                    />

                                    <Input
                                        type="file"
                                        onChange={(e) =>
                                            handleWaterChange(
                                                'outlet',
                                                index,
                                                'test_image',
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <Button
                                variant="secondary"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </Button>

                            <Button onClick={() => setStep(3)}>Next</Button>
                        </div>
                    </div>
                )}

                {/* ================= STEP 3 ================= */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="font-semibold">Preview</h2>

                        <Textarea
                            placeholder="Catatan"
                            value={form.note}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    note: e.target.value,
                                })
                            }
                        />

                        {/* UNIT */}
                        <div>
                            <h3 className="font-medium">Unit Test</h3>
                            {form.unit_tests.map((item, i) => (
                                <div key={i} className="text-sm">
                                    {item.unit_name} - {item.condition}
                                </div>
                            ))}
                        </div>

                        {/* WATER */}
                        <div>
                            <h3 className="font-medium">Water Test - Inlet</h3>
                            {form.water_tests.inlet.map((item, i) => (
                                <div key={i} className="text-sm">
                                    {item.name} - {item.value}
                                </div>
                            ))}

                            <h3 className="mt-2 font-medium">
                                Water Test - Outlet
                            </h3>
                            {form.water_tests.outlet.map((item, i) => (
                                <div key={i} className="text-sm">
                                    {item.name} - {item.value}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <Button
                                variant="secondary"
                                onClick={() => setStep(2)}
                            >
                                Back
                            </Button>

                            <Button onClick={handleSubmit}>
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
