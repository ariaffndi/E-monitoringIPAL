import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { PlusCircle, Search, Trash2, Pencil, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';

import { toast } from 'sonner';
import ModalConfirmDelete from '@/components/modal-confirm-delete';
import ModalCreate from '@/components/modal-create';
import ModalDetail from '@/components/modal-detail';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field } from '@/components/ui/field';
import { FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
            <div className="flex flex-col gap-4 p-6">
                {/* HEADER */}
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <Button
                        onClick={() => setOpenCreate(true)}
                        className="mb-2 w-fit cursor-pointer bg-blue-600 hover:bg-blue-700 sm:mb-0"
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

                <Separator />

                {/* table */}
                <div className="w-full overflow-x-auto rounded-lg border border-sidebar-border/70">
                        <div className="w-full overflow-x-auto rounded-lg border border-sidebar-border/70 p-6">
                            <table className="min-w-full text-center">
                                <tbody className="">
                                    {units?.map((unit: any, index: number) => (
                                        <tr
                                            key={unit.id}
                                            onClick={() => handleView(unit)}
                                            className={`cursor-pointer transition hover:bg-secondary ${
                                                index % 2 === 0
                                                    ? 'bg-white'
                                                    : 'bg-muted/80'
                                            }`}
                                        >
                                            {/* UNIT */}
                                            <td className="flex items-center gap-8 p-4">
                                                <img
                                                    src={`/storage/${unit.image}`}
                                                    alt={unit.name}
                                                    className="h-16 w-16 rounded-lg object-cover"
                                                />

                                                <div className="text-start">
                                                    <p className="font-bold">
                                                        {unit.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {unit.specification}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* DESKRIPSI */}
                                            <td className="max-w-sm text-sm truncate p-3 whitespace-nowrap sm:table-cell">
                                                {unit.description}
                                            </td>

                                            {/* DIMENSI */}
                                            <td className="p-3 text-center">
                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                                                    {unit.dimension}
                                                </span>
                                            </td>

                                            {/* ACTION */}
                                            <td className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="cursor-pointer"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <MoreVertical
                                                                size={16}
                                                            />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        align="end"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(
                                                                    unit,
                                                                );
                                                            }}
                                                            className="cursor-pointer text-yellow-500 focus:text-yellow-500"
                                                        >
                                                            <Pencil
                                                                size={16}
                                                                className="mr-2 text-yellow-500"
                                                            />
                                                            Edit
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                confirmDelete(
                                                                    unit.id,
                                                                );
                                                            }}
                                                            className="cursor-pointer text-red-500 focus:text-red-500"
                                                        >
                                                            <Trash2
                                                                size={16}
                                                                className="mr-2 text-red-500"
                                                            />
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                    {(isEdit && selectedUnit?.image) || data.image ? (
                        <div>
                            <img
                                src={
                                    data.image
                                        ? URL.createObjectURL(data.image)
                                        : `/storage/${selectedUnit.image}`
                                }
                                alt={data.name}
                                className="mt-2 h-25 w-25 rounded-lg object-cover"
                            />
                        </div>
                    ) : null}

                    <Input
                        type="file"
                        className="cursor-pointer"
                        onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
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
                            <div className="flex justify-center p-2">
                                <img
                                    src={`/storage/${selectedUnit.image}`}
                                    alt={selectedUnit.name}
                                    className="mt-2 h-50 w-50 rounded-full object-cover"
                                />
                            </div>
                        
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
