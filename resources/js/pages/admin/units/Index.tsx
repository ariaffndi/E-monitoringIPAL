import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    PlusCircle,
    Search,
    Trash2,
    Pencil,
    MoreVertical,
    ImageOff,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ModalConfirmDelete from '@/components/modal-confirm-delete';
import ModalCreate from '@/components/modal-create';
import ModalDetail from '@/components/modal-detail';
import ProjectRequired from '@/components/project/project-required';
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

export default function Units({ units, filters }: any) {
    // ================= STATE =================
    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<any>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');
    const [isEdit, setIsEdit] = useState(false);
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

    // ================= SUBMIT =================
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

            return;
        }

        post('/units', {
            forceFormData: true,

            onSuccess: () => {
                setOpenCreate(false);
                reset();
                toast.success('Unit berhasil ditambahkan');
            },
        });
    };

    // ================= VIEW =================
    const handleView = (unit: any) => {
        setSelectedUnit(unit);
        setOpenDetail(true);
    };

    // ================= EDIT =================
    const handleEdit = (unit: any) => {
        setIsEdit(true);
        setSelectedUnit(unit);
        setData({
            name: unit.name || '',
            specification: unit.specification || '',
            dimension: unit.dimension || '',
            description: unit.description || '',
            image: null,
        });

        setOpenCreate(true);
    };

    // ================= DELETE =================
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

    // ================= CLOSE MODAL =================
    const handleCloseModal = () => {
        setOpenCreate(false);
        setIsEdit(false);
        reset();
    };

    // ================= CONFIRM DELETE =================
    const confirmDelete = (id: number) => {
        setSelectedId(id);
        setOpenDelete(true);
    };

    // ================= SEARCH =================
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        const delay = setTimeout(() => {
            router.get(
                '/units',
                search
                    ? {
                        search,
                    }
                    : {},
                {
                    preserveState: true,
                    replace: true,

                    onFinish: () => setLoading(false),
                },
            );
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setSearch('');

            router.get(
                '/units',
                {},
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }
    };

    return (
        <>
            <ProjectRequired>
            <Head title="Units" />

            <div className="flex flex-col gap-4 p-6">
                {/* ================= HEADER ================= */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Unit Management
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage and monitor water treatment infrastructure
                            nodes.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative w-full sm:w-80">
                            <Search
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                                size={16}
                            />

                            <Input
                                placeholder="Cari unit..."
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
                            className="cursor-pointer bg-blue-600 text-white transition-transform duration-500 hover:scale-105 hover:bg-blue-700"
                        >
                            <PlusCircle />
                            Tambah Unit
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* ================= TABLE ================= */}
                <div className="w-full overflow-x-auto rounded-lg border p-6">
                    <table className="min-w-full text-center">
                        <tbody>
                            {units?.length ? (
                                units.map((unit: any, index: number) => (
                                    <tr
                                        key={unit.id}
                                        onClick={() => handleView(unit)}
                                        className={`cursor-pointer transition hover:bg-secondary ${
                                            index % 2 === 0
                                                ? 'bg-base'
                                                : 'bg-secondary/50'
                                        }`}
                                    >
                                        {/* UNIT */}
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                {unit.image ? (
                                                    <img
                                                        src={`/storage/${unit.image}`}
                                                        alt={unit.name}
                                                        className="h-16 w-16 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                                                        <ImageOff className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                )}

                                                <div className="text-start">
                                                    <p className="font-bold">
                                                        {unit.name || '-'}
                                                    </p>

                                                    <p className="text-sm text-muted-foreground">
                                                        {unit.specification ||
                                                            'Tidak ada spesifikasi'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* DESKRIPSI */}
                                        <td className="max-w-xs truncate p-3 text-sm whitespace-nowrap sm:table-cell">
                                            {unit.description ||
                                                'Tidak ada deskripsi'}
                                        </td>

                                        {/* DIMENSI */}
                                        <td className="p-3 text-center whitespace-nowrap">
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                                                {unit.dimension || '-'}
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
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

                                                            handleEdit(unit);
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
                                ))
                            ) : (
                                <tr>
                                    <td className="py-10 text-center text-muted-foreground">
                                        Belum ada data unit IPAL
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= MODAL CREATE ================= */}
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
                    <FieldLabel htmlFor="picture">Gambar</FieldLabel>

                    {(isEdit && selectedUnit?.image) || data.image ? (
                        <div className="mb-3">
                            <img
                                src={
                                    data.image
                                        ? URL.createObjectURL(data.image)
                                        : `/storage/${selectedUnit?.image}`
                                }
                                alt={data.name || 'Preview'}
                                className="h-24 w-24 rounded-lg object-cover"
                            />
                        </div>
                    ) : (
                        <div className="mb-3 text-sm text-muted-foreground">
                            Belum ada gambar
                        </div>
                    )}

                    <Input
                        type="file"
                        className="cursor-pointer"
                        onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;

                            setData('image', file);
                        }}
                    />

                    {errors.image && (
                        <p className="text-xs text-red-500">{errors.image}</p>
                    )}
                </Field>
            </ModalCreate>

            {/* ================= MODAL DETAIL ================= */}
            <ModalDetail
                open={openDetail}
                setOpen={setOpenDetail}
                title="Detail Unit"
            >
                {selectedUnit ? (
                    <>
                        <div className="flex justify-center p-2">
                            {selectedUnit.image ? (
                                <img
                                    src={`/storage/${selectedUnit.image}`}
                                    alt={selectedUnit.name}
                                    className="mt-2 h-50 w-50 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-50 w-50 items-center justify-center rounded-full bg-muted">
                                    <ImageOff className="h-10 w-10 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        <div>
                            <span className="font-semibold">Nama:</span>{' '}
                            {selectedUnit.name || '-'}
                        </div>

                        <div>
                            <span className="font-semibold">Spesifikasi:</span>{' '}
                            {selectedUnit.specification || '-'}
                        </div>

                        <div>
                            <span className="font-semibold">Dimensi:</span>{' '}
                            {selectedUnit.dimension || '-'}
                        </div>

                        <div>
                            <span className="font-semibold">Deskripsi:</span>{' '}
                            {selectedUnit.description || 'Tidak ada deskripsi'}
                        </div>
                    </>
                ) : (
                    <div className="text-sm text-muted-foreground">
                        Data unit tidak tersedia
                    </div>
                )}
            </ModalDetail>

            {/* ================= MODAL DELETE ================= */}
            <ModalConfirmDelete
                open={openDelete}
                setOpen={setOpenDelete}
                title="Hapus Unit?"
                description="Apakah anda yakin ingin menghapus unit ini?"
                onConfirm={handleDelete}
            />
            </ProjectRequired>
        </>
    );
}

Units.layout = {
    breadcrumbs: [
        {
            title: 'Home',
            href: '/dashboard',
        },
        {
            title: 'Unit IPAL',
        },
    ],
};