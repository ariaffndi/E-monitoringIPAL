import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { PlusCircle, Search, Trash2, Pencil } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    waterparameters: any[];
    filters: {
        search?: string;
    };
};

export default function WaterParameters({ waterparameters, filters }: Props) {
    // ================= STATE =================
    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedWaterParameter, setSelectedWaterParameter] =
        useState<any>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // ================= SEARCH =================
    const [search, setSearch] = useState(filters?.search || '');
    const [filterType, setFilterType] = useState<string>('all');
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

    // ================= HANDLER =================
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
            name: waterparameter.name || '',
            unit: waterparameter.unit || '',
            min_value: String(waterparameter.min_value) || '',
            max_value: String(waterparameter.max_value) || '',
            type: waterparameter.type || 'fisika',
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

    // ================= SEARCH =================
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
            router.get(
                '/water-parameters',
                {},
                {
                    preserveState: true,
                },
            );
        }
    };

    // ================= FILTER =================
    const filteredWaterParameters =
        waterparameters
            ?.filter((item: any) => item !== null)
            ?.filter((item: any) =>
                filterType === 'all' ? true : item.type === filterType,
            ) || [];

    // ================= BADGE =================
    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'fisika':
                return 'bg-blue-100 text-blue-700';
            case 'kimia':
                return 'bg-purple-100 text-purple-700';
            case 'biologi':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <>
            <Head title="Water Parameters" />

            <div className="flex flex-col gap-4 p-6">
                {/* HEADER */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Water Parameter Management
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Configure and monitor chemical thresholds for
                            effluent compliance.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative w-full sm:w-80">
                            <Search
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                                size={16}
                            />

                            <Search
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                                size={16}
                            />

                            <Input
                                placeholder="Cari parameter..."
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

                        <Button
                            onClick={() => setOpenCreate(true)}
                            className="cursor-pointer bg-blue-600 transition-transform duration-500 hover:scale-105 hover:bg-blue-700"
                        >
                            <PlusCircle />
                            Tambah Parameter
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* TABLE */}
                <div className="w-full overflow-x-auto rounded-lg border">
                    <table className="table min-w-full text-center text-sm">
                        <thead>
                            <tr className="bg-secondary">
                                <th className="p-2">Nama</th>
                                <th className="p-2">Satuan</th>
                                <th className="p-2">Nilai Minimum</th>
                                <th className="p-2">Nilai Maksimum</th>
                                <th className="flex items-center justify-center p-2">
                                    <Select
                                        value={filterType}
                                        onValueChange={(value) =>
                                            setFilterType(value)
                                        }
                                    >
                                        <SelectTrigger className="h-auto border-none bg-transparent p-0 text-xs shadow-none ring-0 focus:ring-0 focus:outline-none">
                                            <SelectValue placeholder="Jenis" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="all">
                                                    Semua
                                                </SelectItem>
                                                <SelectItem value="fisika">
                                                    Fisika
                                                </SelectItem>
                                                <SelectItem value="kimia">
                                                    Kimia
                                                </SelectItem>
                                                <SelectItem value="biologi">
                                                    Biologi
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </th>
                                <th className="p-2">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredWaterParameters.length > 0 ? (
                                filteredWaterParameters.map(
                                    (waterparameter: any, index: number) => (
                                        <tr
                                            key={waterparameter.id}
                                            onClick={() =>
                                                handleView(waterparameter)
                                            }
                                            className={`cursor-pointer transition hover:bg-secondary ${
                                                index % 2 === 0
                                                    ? 'bg-white'
                                                    : 'bg-muted/50'
                                            }`}
                                        >
                                            <td className="p-2 font-semibold">
                                                {waterparameter.name || '-'}
                                            </td>
                                            <td className="p-2">
                                                {waterparameter.unit || '-'}
                                            </td>
                                            <td className="p-2">
                                                {waterparameter.min_value ??
                                                    '-'}
                                            </td>
                                            <td className="p-2">
                                                {waterparameter.max_value ??
                                                    '-'}
                                            </td>
                                            <td className="p-2">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs capitalize ${getTypeBadge(
                                                        waterparameter.type,
                                                    )}`}
                                                >
                                                    {waterparameter.type || '-'}
                                                </span>
                                            </td>

                                            <td className="p-2">
                                                <div className="flex flex-nowrap items-center justify-center gap-2">
                                                    <Button
                                                        title="Edit Data"
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            handleEdit(
                                                                waterparameter,
                                                            );
                                                        }}
                                                        size="sm"
                                                        className="cursor-pointer bg-yellow-100 text-yellow-700 hover:bg-yellow-300"
                                                    >
                                                        <Pencil size={20} />
                                                    </Button>

                                                    <Button
                                                        title="Hapus Data"
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            confirmDelete(
                                                                waterparameter.id,
                                                            );
                                                        }}
                                                        size="sm"
                                                        className="cursor-pointer bg-red-100 text-red-700 hover:bg-red-300"
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ),
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-10 text-center text-sm text-muted-foreground"
                                    >
                                        {search || filterType !== 'all'
                                            ? 'Parameter tidak ditemukan'
                                            : 'Belum ada data parameter'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL CREATE & EDIT */}
            <ModalCreate
                open={openCreate}
                setOpen={handleCloseModal}
                title={isEdit ? 'Edit Parameter' : 'Tambah Parameter'}
                onSubmit={handleSubmit}
                processing={processing}
            >
                <Field>
                    <FieldLabel htmlFor="name">Nama</FieldLabel>

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
                    <FieldLabel htmlFor="unit">Satuan</FieldLabel>

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
                        <SelectTrigger>
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

            {/* MODAL DETAIL */}
            <ModalDetail
                open={openDetail}
                setOpen={setOpenDetail}
                title="Detail Parameter Air"
            >
                {selectedWaterParameter ? (
                    <div className="space-y-3">
                        <div>
                            <span className="font-semibold">Nama:</span>{' '}
                            {selectedWaterParameter.name || '-'}
                        </div>

                        <div>
                            <span className="font-semibold">Satuan:</span>{' '}
                            {selectedWaterParameter.unit || '-'}
                        </div>

                        <div>
                            <span className="font-semibold">
                                Nilai Minimum:
                            </span>{' '}
                            {selectedWaterParameter.min_value ?? '-'}
                        </div>

                        <div>
                            <span className="font-semibold">
                                Nilai Maksimum:
                            </span>{' '}
                            {selectedWaterParameter.max_value ?? '-'}
                        </div>

                        <div>
                            <span className="font-semibold">
                                Tipe Parameter:
                            </span>{' '}
                            {selectedWaterParameter.type || '-'}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Data parameter tidak tersedia
                    </p>
                )}
            </ModalDetail>

            {/* MODAL DELETE */}
            <ModalConfirmDelete
                open={openDelete}
                setOpen={setOpenDelete}
                title="Hapus Parameter?"
                description="Apakah anda yakin ingin menghapus parameter ini?"
                onConfirm={handleDelete}
            />
        </>
    );
}

WaterParameters.layout = {
    breadcrumbs: [
        {
            title: 'Home',
            href: '/dashboard',
        },
        {
            title: 'Parameter Air',
        },
    ],
};