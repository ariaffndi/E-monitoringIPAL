import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { PlusCircle, Search, Trash2, Info, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';

import { toast } from 'sonner';
import ModalConfirmDelete from '@/components/modal-confirm-delete';
import ModalCreate from '@/components/modal-create';
import ModalDetail from '@/components/modal-detail';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

export default function WaterParameters({ waterparameters }: any) {
    // state
    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedWaterParameter, setSelectedWaterParameter] =
        useState<any>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        unit: string;
        min_value: string;
        max_value: string;
        type: string;
    }>({
        name: '',
        unit: '',
        min_value: '',
        max_value: '',
        type: 'fisika',
    });
    const [isEdit, setIsEdit] = useState(false);

    // handler
    const handleSubmit = () => {
        if (isEdit && selectedWaterParameter) {
            router.post(
                `/water-parameters/${selectedWaterParameter.id}`,
                {
                    _method: 'put',
                    ...data,
                },
                {
                    forceFormData: true,
                    onSuccess: () => {
                        setOpenCreate(false);
                        reset();
                        setIsEdit(false);
                        toast.success('Parameter berhasil diupdate');
                    },
                },
            );
        } else {
            post('/water-parameters', {
                forceFormData: true,
                onSuccess: () => {
                    setOpenCreate(false);
                    reset();
                    toast.success('Parameter berhasil ditambahkan');
                },
            });
        }
    };

    const handleView = (waterparameter: any) => {
        setSelectedWaterParameter(waterparameter);
        setOpenDetail(true);
    };

    const handleEdit = (waterparameter: any) => {
        setIsEdit(true);
        setSelectedWaterParameter(waterparameter);

        setData({
            name: waterparameter.name,
            unit: waterparameter.unit,
            min_value: waterparameter.min_value,
            max_value: waterparameter.max_value,
            type: waterparameter.type,
        });

        setOpenCreate(true);
    };

    const handleDelete = () => {
        if (!selectedId) {
            return;
        }

        router.delete(`/water-parameters/${selectedId}`, {
            onSuccess: () => {
                setOpenDelete(false);
                toast.success('Parameter berhasil dihapus');
            },
        });
    };

    const handleCloseModal = () => {
        setOpenCreate(false);
        setIsEdit(false);
        reset();
    };

    const confirmDelete = (id: number) => {
        setSelectedId(id);
        setOpenDelete(true);
    };

    // search
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        const delay = setTimeout(() => {
            router.get('/water-parameters', search ? { search } : {}, {
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
            router.get('/water-parameters', {}, { preserveState: true });
        }
    };

    return (
        <>
            <Head title="WaterParameters" />
            <div className="flex flex-col gap-4 p-4">
                {/* header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <Button
                        onClick={() => setOpenCreate(true)}
                        className="cursor-pointer bg-blue-600 text-sm hover:bg-blue-700"
                    >
                        <PlusCircle />
                        Tambah Unit
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

                {/* table */}
                <div className="w-full overflow-x-auto rounded-lg border">
                    <table className="table min-w-full text-center text-sm">
                        <thead>
                            <tr className="bg-secondary">
                                <th className="p-2">Nama</th>
                                <th className="p-2">Satuan</th>
                                <th className="p-2">Nilai Minimum</th>
                                <th className="p-2">Nilai Maksimum</th>
                                <th className="p-2">Jenis</th>
                                <th className="p-2">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {waterparameters
                                ?.filter(
                                    (waterparameter: any) =>
                                        waterparameter !== null,
                                )
                                .map((waterparameter: any) => (
                                    <tr
                                        key={waterparameter.id}
                                        className="hover:bg-secondary"
                                    >
                                        <td className="p-2">
                                            {waterparameter.name}
                                        </td>
                                        <td className="p-2">
                                            {waterparameter.unit}
                                        </td>
                                        <td className="p-2">
                                            {waterparameter.min_value}
                                        </td>
                                        <td className="p-2">
                                            {waterparameter.max_value}
                                        </td>
                                        <td className="p-2">
                                            {waterparameter.type}
                                        </td>
                                        <td className="p-2">
                                            <div className="flex flex-nowrap items-center justify-center gap-2">
                                                <Button
                                                    title="Detail Data"
                                                    onClick={() =>
                                                        handleView(
                                                            waterparameter,
                                                        )
                                                    }
                                                    size="sm"
                                                    className="cursor-pointer bg-sky-100 text-sky-700 hover:bg-sky-300"
                                                >
                                                    <Info />
                                                </Button>
                                                <Button
                                                    title="Edit Data"
                                                    onClick={() =>
                                                        handleEdit(
                                                            waterparameter,
                                                        )
                                                    }
                                                    size="sm"
                                                    className="cursor-pointer bg-yellow-100 text-yellow-700 hover:bg-yellow-300"
                                                >
                                                    <Pencil size={20} />
                                                </Button>
                                                <Button
                                                    title="Hapus Data"
                                                    onClick={() =>
                                                        confirmDelete(
                                                            waterparameter.id,
                                                        )
                                                    }
                                                    size="sm"
                                                    className="cursor-pointer bg-red-100 text-red-700 hover:bg-red-300"
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* modal create & edit */}
            <ModalCreate
                open={openCreate}
                setOpen={handleCloseModal}
                title={isEdit ? 'Edit Unit' : 'Tambah Unit'}
                onSubmit={handleSubmit}
                processing={processing}
            >
                <Field>
                    <FieldLabel htmlFor="Name">Nama</FieldLabel>
                    <Input
                        placeholder="Nama"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mb-2"
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="Unit">Satuan</FieldLabel>
                    <Input
                        placeholder="Satuan"
                        value={data.unit}
                        onChange={(e) => setData('unit', e.target.value)}
                        className="mb-2"
                    />
                    {errors.unit && (
                        <p className="text-xs text-red-500">{errors.unit}</p>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="min_value">Nilai Minimum</FieldLabel>
                    <Input
                        type="number"
                        placeholder="Nilai Minimum"
                        value={data.min_value}
                        onChange={(e) => setData('min_value', e.target.value)}
                        className="mb-2"
                    />
                    {errors.min_value && (
                        <p className="text-xs text-red-500">
                            {errors.min_value}
                        </p>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="max_value">Nilai Maksimum</FieldLabel>
                    <Input
                        type="number"
                        placeholder="Nilai Maksimum"
                        value={data.max_value}
                        onChange={(e) => setData('max_value', e.target.value)}
                        className="mb-2"
                    />
                    {errors.max_value && (
                        <p className="text-xs text-red-500">
                            {errors.max_value}
                        </p>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="type">Tipe Parameter</FieldLabel>
                    <Select
                        value={data.type}
                        onValueChange={(value) => setData('type', value)}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Tipe Parameter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="fisika">Fisika</SelectItem>
                                <SelectItem value="kimia">Kimia</SelectItem>
                                <SelectItem value="biologi">Biologi</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </ModalCreate>

            {/* modal detail */}
            <ModalDetail
                open={openDetail}
                setOpen={setOpenDetail}
                title="Detail Unit"
            >
                {selectedWaterParameter && (
                    <>
                        <div>
                            <span className="font-semibold">Nama:</span>{' '}
                            {selectedWaterParameter.name}
                        </div>
                        <div>
                            <span className="font-semibold">Satuan:</span>{' '}
                            {selectedWaterParameter.unit}
                        </div>
                        <div>
                            <span className="font-semibold">Nilai Minimum:</span>{' '}
                            {selectedWaterParameter.min_value}
                        </div>
                        <div>
                            <span className="font-semibold">Nilai Maksimum:</span>{' '}
                            {selectedWaterParameter.max_value}
                        </div>
                        <div>
                            <span className="font-semibold">Tipe Parameter:</span>{' '}
                            {selectedWaterParameter.type}
                        </div>
                    </>
                )}
            </ModalDetail>

            {/* modal delete */}
            <ModalConfirmDelete
                open={openDelete}
                setOpen={setOpenDelete}
                title="Hapus Unit?"
                description="Apakah anda yakin ingin menghapus parameter ini?"
                onConfirm={handleDelete}
            />
        </>
    );
}

WaterParameters.layout = {
    breadcrumbs: [
        {
            title: 'Parameter Air',
        },
    ],
};
