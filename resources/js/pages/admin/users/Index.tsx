import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { PlusCircle, Search, MoreVertical, Trash2, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';

import { toast } from 'sonner';
import ModalConfirmDelete from '@/components/modal-confirm-delete';
import ModalCreate from '@/components/modal-create';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    image?: string | null;
};

type Props = {
    users: User[];
    filters: {
        search?: string;
    };
};

export default function Users({ users, filters }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // ================= SEARCH =================
    const [search, setSearch] = useState(filters?.search || '');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'operator',
        password: '',
        image: null as File | null,
    });

    // ================= CREATE =================
    const handleSubmit = () => {
        if (isEdit && selectedUser) {
            router.post(
                `/users/${selectedUser.id}`,
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

                        toast.success('User berhasil diupdate');
                    },
                },
            );

            return;
        }

        post('/users', {
            forceFormData: true,

            onSuccess: () => {
                setOpenCreate(false);

                reset();

                toast.success('User berhasil ditambahkan');
            },
        });
    };

    // ================= EDIT =================
    const handleEdit = (user: User) => {
        setIsEdit(true);

        setSelectedUser(user);

        setData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'operator',
            password: '',
            image: null,
        });

        setOpenCreate(true);
    };

    // ================= DELETE =================
    const confirmDelete = (id: number) => {
        setSelectedId(id);
        setOpenDelete(true);
    };

    const handleDelete = () => {
        if (!selectedId) {
            return;
        }

        router.delete(`/users/${selectedId}`, {
            onSuccess: () => {
                setOpenDelete(false);

                toast.success('User berhasil dihapus');
            },
        });
    };

    // ================= CLOSE MODAL =================
    const handleCloseModal = () => {
        setOpenCreate(false);

        setIsEdit(false);

        reset();
    };

    // ================= SEARCH =================
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        const delay = setTimeout(() => {
            router.get('/users', search ? { search } : {}, {
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
                '/users',
                {},
                {
                    preserveState: true,
                },
            );
        }
    };

    // ================= HELPER =================
    const getInitial = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <>
            <Head title="Users" />

            <div className="flex flex-col gap-4 p-6">
                {/* HEADER */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Operator Management
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage plant operators for this project to give them
                            access to this project
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative w-full sm:w-80">
                            <Search
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                                size={16}
                            />

                            <Input
                                placeholder="Cari operator..."
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
                            Tambah Operator
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* CARD LIST */}
                {users.length > 0 ? (
                    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4 mt-2">
                        {users.map((user) => (
                            <Card
                                key={user.id}
                                className="relative overflow-hidden rounded-xl pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* TOP BACKGROUND */}
                                <div className="relative h-20">
                                    {/* DROPDOWN */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-3 right-3 z-20 cursor-pointer  hover:bg-white/20"
                                            >
                                                <MoreVertical size={18} />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                className="cursor-pointer text-yellow-500 focus:text-yellow-500"
                                                onClick={() => handleEdit(user)}
                                            >
                                                <Pencil
                                                    size={16}
                                                    className="mr-2 text-yellow-500"
                                                />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="cursor-pointer text-red-500 focus:text-red-500"
                                                onClick={() =>
                                                    confirmDelete(user.id)
                                                }
                                            >
                                                <Trash2
                                                    size={16}
                                                    className="mr-2 text-red-500"
                                                />
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* AVATAR */}
                                    <div className="absolute top-full left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                                        <div className="h-26 w-26 overflow-hidden rounded-full border-4 border-background bg-background shadow-md">
                                            {user.image ? (
                                                <img
                                                    src={`/storage/${user.image}`}
                                                    alt={user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-blue-100 text-3xl font-bold text-blue-700">
                                                    {getInitial(user.name)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <CardContent className="pt-16 text-center">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            {user.name}
                                        </h2>

                                        <p className="text-sm text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>

                                    <Badge className="mt-4 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                        {user.role}
                                    </Badge>
                                </CardContent>

                                <div className="px-6">
                                    <Separator />
                                </div>

                                {/* FOOTER */}
                                <CardFooter className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 cursor-pointer text-yellow-500 hover:text-yellow-600"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <Pencil size={16} />
                                        Edit
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="cursor-pointer text-red-500 hover:text-red-600"
                                        onClick={() => confirmDelete(user.id)}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            {search
                                ? 'Operator tidak ditemukan'
                                : 'Belum ada operator'}
                        </p>
                    </div>
                )}
            </div>

            {/* MODAL CREATE */}
            <ModalCreate
                open={openCreate}
                setOpen={handleCloseModal}
                title={isEdit ? 'Edit Operator' : 'Tambah Operator'}
                onSubmit={handleSubmit}
                processing={processing}
            >
                <Field>
                    <FieldLabel htmlFor="Name">Nama</FieldLabel>

                    <Input
                        placeholder="Nama"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    {errors.name && (
                        <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="Email">Email</FieldLabel>

                    <Input
                        placeholder={
                            isEdit ? 'Email tidak dapat diubah' : 'Email'
                        }
                        type="email"
                        value={data.email}
                        disabled={isEdit}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {isEdit && (
                        <p className="text-xs text-red-500">
                            email hanya bisa diubah oleh operator
                        </p>
                    )}

                    {errors.email && (
                        <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="Role">Role</FieldLabel>

                    <Input value="Operator" disabled />
                </Field>

                <Field>
                    <FieldLabel htmlFor="Password">Password</FieldLabel>

                    <Input
                        placeholder={
                            isEdit ? 'Password tidak dapat diubah' : 'Password'
                        }
                        type="password"
                        value={data.password}
                        disabled={isEdit}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    {isEdit && (
                        <p className="text-xs text-red-500">
                            Password hanya bisa diubah oleh operator
                        </p>
                    )}

                    {errors.password && (
                        <p className="text-xs text-red-500">
                            {errors.password}
                        </p>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="picture">Foto</FieldLabel>

                    {(isEdit && selectedUser?.image) || data.image ? (
                        <div className="mb-3">
                            <img
                                src={
                                    data.image
                                        ? URL.createObjectURL(data.image)
                                        : `/storage/${selectedUser?.image}`
                                }
                                alt="Preview"
                                className="h-24 w-24 rounded-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="mb-3 text-sm text-muted-foreground">
                            Belum ada foto
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

            {/* MODAL DELETE */}
            <ModalConfirmDelete
                open={openDelete}
                setOpen={setOpenDelete}
                title="Hapus User?"
                description="Apakah anda yakin ingin menghapus user ini?"
                onConfirm={handleDelete}
            />
        </>
    );
}

Users.layout = {
    breadcrumbs: [
        {
            title: 'Home',
            href: '/dashboard',
        },
        {
            title: 'Data Operator',
        },
    ],
};