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
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

export default function Units({ units }: any) {
    // state
    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<any>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        specification: string;
        dimension: string;
        description: string;
        image: File | null;
    }>({
        name: '',
        specification: '',
        dimension: '',
        description: '',
        image: null,
    });
    const [isEdit, setIsEdit] = useState(false);

    // handler
    const handleSubmit = () => {
        if (isEdit && selectedUnit) {
            router.post(
                `/units/${selectedUnit.id}`,
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
                        toast.success('Unit berhasil diupdate');
                    },
                },
            );
        } else {
            post('/units', {
                forceFormData: true,
                onSuccess: () => {
                    setOpenCreate(false);
                    reset();
                    toast.success('Unit berhasil ditambahkan');
                },
            });
        }
    };

    const handleView = (unit: any) => {
        setSelectedUnit(unit);
        setOpenDetail(true);
    };

    const handleEdit = (unit: any) => {
        setIsEdit(true);
        setSelectedUnit(unit);

        setData({
            name: unit.name,
            specification: unit.specification,
            dimension: unit.dimension,
            description: unit.description,
            image: null,
        });

        setOpenCreate(true);
    };

    const handleDelete = () => {
        if (!selectedId) {
            return;
        }

        router.delete(`/units/${selectedId}`, {
            onSuccess: () => {
                setOpenDelete(false);
                toast.success('Unit berhasil dihapus');
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
            router.get('/units', search ? { search } : {}, {
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
            router.get('/units', {}, { preserveState: true });
        }
    };

    return (
        <>
            <Head title="Units" />
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
                                <th className="p-2">No</th>
                                <th className="p-2">Foto</th>
                                <th className="p-2">Nama</th>
                                <th className="p-2">Deskripsi</th>
                                <th className="p-2">Dimensi</th>
                                <th className="p-2">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {units
                                ?.filter((unit: any) => unit !== null)
                                .map((unit: any, index: number) => (
                                    <tr
                                        key={unit.id}
                                        className="hover:bg-secondary"
                                    >
                                        <td className="p-2">{index + 1}</td>
                                        <td className="flex justify-center p-2">
                                            <img
                                                src={`/storage/${unit.image}`}
                                                alt={unit.name}
                                                className="mt-2 h-10 w-10 rounded-full object-cover"
                                            />
                                        </td>
                                        <td className="p-2">{unit.name}</td>
                                        <td className="hidden max-w-50 truncate p-2 whitespace-nowrap sm:table-cell">
                                            {unit.description}
                                        </td>
                                        <td className="p-2">
                                            {unit.dimension}
                                        </td>

                                        <td className="p-2">
                                            <div className="flex flex-nowrap items-center justify-center gap-2">
                                                <Button
                                                    title="Detail Data"
                                                    onClick={() =>
                                                        handleView(unit)
                                                    }
                                                    size="sm"
                                                    className="cursor-pointer bg-sky-100 text-sky-700 hover:bg-sky-300"
                                                >
                                                    <Info />
                                                </Button>
                                                <Button
                                                    title="Edit Data"
                                                    onClick={() =>
                                                        handleEdit(unit)
                                                    }
                                                    size="sm"
                                                    className="cursor-pointer bg-yellow-100 text-yellow-700 hover:bg-yellow-300"
                                                >
                                                    <Pencil size={20} />
                                                </Button>
                                                <Button
                                                    title="Hapus Data"
                                                    onClick={() =>
                                                        confirmDelete(unit.id)
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

            {/* modal create */}
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
                    <FieldLabel htmlFor="Specification">Spesifikasi</FieldLabel>
                    <Input
                        placeholder="Spesifikasi"
                        value={data.specification}
                        onChange={(e) =>
                            setData('specification', e.target.value)
                        }
                        className="mb-2"
                    />
                    {errors.specification && (
                        <p className="text-xs text-red-500">
                            {errors.specification}
                        </p>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="Dimension">Dimensi</FieldLabel>
                    <Input
                        placeholder="Dimensi"
                        value={data.dimension}
                        onChange={(e) => setData('dimension', e.target.value)}
                        className="mb-2"
                    />
                    {errors.dimension && (
                        <p className="text-xs text-red-500">
                            {errors.dimension}
                        </p>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="Description">Deskripsi</FieldLabel>
                    <Textarea
                        placeholder="Deskripsi"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="mb-2"
                    />
                    {errors.description && (
                        <p className="text-xs text-red-500">
                            {errors.description}
                        </p>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="picture">Picture</FieldLabel>
                    <div>
                        <img
                            src={`/storage/${data.image}`}
                            alt={data.name}
                            className="mt-2 h-25 w-25 rounded-lg object-cover"
                        />
                    </div>
                    <Input
                        type="file"
                        className="cursor-pointer"
                        onChange={(e) => {
                            const file = e.target.files
                                ? e.target.files[0]
                                : null;
                            setData('image', file);
                        }}
                    />
                </Field>
            </ModalCreate>

            {/* modal detail */}
            <ModalDetail
                open={openDetail}
                setOpen={setOpenDetail}
                title="Detail Unit"
            >
                {selectedUnit && (
                    <>
                        <div>
                            <span className="font-semibold">Nama:</span>{' '}
                            {selectedUnit.name}
                        </div>

                        <div>
                            <span className="font-semibold">Spesifikasi:</span>{' '}
                            {selectedUnit.specification}
                        </div>

                        <div>
                            <span className="font-semibold">Dimensi:</span>{' '}
                            {selectedUnit.dimension}
                        </div>

                        <div>
                            <span className="font-semibold">Deskripsi:</span>{' '}
                            {selectedUnit.description}
                        </div>

                        <div>
                            <span className="font-semibold">Gambar:</span>{' '}
                            <div className="flex justify-center p-2">
                                <img
                                    src={`/storage/${selectedUnit.image}`}
                                    alt={selectedUnit.name}
                                    className="mt-2 h-50 w-50 rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </>
                )}
            </ModalDetail>

            {/* modal delete */}
            <ModalConfirmDelete
                open={openDelete}
                setOpen={setOpenDelete}
                title="Hapus Unit?"
                description="Apakah anda yakin ingin menghapus unit ini?"
                onConfirm={handleDelete}
            />
        </>
    );
}

Units.layout = {
    breadcrumbs: [
        {
            title: 'Unit IPAL',
        },
    ],
};
