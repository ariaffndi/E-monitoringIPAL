import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    PlusCircle,
    Search,
    HardHat,
    BookCheck,
    Trash,
    Info,
} from 'lucide-react';
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

export default function Users({ users }: any) {
    // state
    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'operator',
        password: '',
    });

    // handler
    const handleCreate = () => {
        post('/users', {
            onSuccess: () => {
                setOpenCreate(false);
                reset();

                toast.success('User berhasil ditambahkan');
            },
        });
    };

    const handleView = (user: any) => {
        setSelectedUser(user);
        setOpenDetail(true);
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

    const confirmDelete = (id: number) => {
        setSelectedId(id);
        setOpenDelete(true);
    };

    // search
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
            router.get('/users', {}, { preserveState: true });
        }
    };

    return (
        <>
            <Head title="Users" />
            <div className="flex flex-col gap-4 p-4">
                {/* header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <Button
                        onClick={() => setOpenCreate(true)}
                        className="cursor-pointer bg-blue-600 text-sm hover:bg-blue-700"
                    >
                        <PlusCircle />
                        Tambah User
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
                                <th className="p-2">Nama</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user: any, index: number) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-secondary"
                                >
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2">{user.email}</td>

                                    <td className="p-2">
                                        {user.role === 'admin' ? (
                                            <div className="inline-flex items-center gap-2 rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                                                <BookCheck className="size-3" />
                                                Admin
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                                                <HardHat className="size-3" />
                                                Operator
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-2">
                                        <div className="flex flex-nowrap items-center justify-center gap-2">
                                            <Button
                                                title="Detail Data"
                                                onClick={() => handleView(user)}
                                                className="cursor-pointer bg-sky-100 text-sky-700 hover:bg-sky-300"
                                            >
                                                <Info />
                                            </Button>
                                            <Button
                                                title="Hapus Data"
                                                onClick={() =>
                                                    confirmDelete(user.id)
                                                }
                                                className="cursor-pointer bg-red-100 text-red-700 hover:bg-red-300"
                                            >
                                                <Trash />
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
                setOpen={setOpenCreate}
                title="Tambah User"
                onSubmit={handleCreate}
                processing={processing}
            >
                <Field>
                    <FieldLabel htmlFor="Name">Name</FieldLabel>
                    <Input
                        placeholder="Nama"
                        onChange={(e) => setData('name', e.target.value)}
                        className="mb-2"
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        placeholder="Email"
                        type="email"
                        onChange={(e) => setData('email', e.target.value)}
                        className="mb-2"
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="role">Role</FieldLabel>
                    <select
                        className="w-full rounded border p-2"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                    >
                        <option value="admin">Admin</option>
                        <option value="operator">Operator</option>
                    </select>
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        placeholder="Password"
                        type="password"
                        onChange={(e) => setData('password', e.target.value)}
                        className="mb-2"
                    />
                    {errors.password && (
                        <p className="text-xs text-red-500">
                            {errors.password}
                        </p>
                    )}
                </Field>
            </ModalCreate>

            {/* modal detail */}
            <ModalDetail
                open={openDetail}
                setOpen={setOpenDetail}
                title="Detail User"
            >
                {selectedUser && (
                    <>
                        <div>
                            <span className="font-medium">Nama:</span>{' '}
                            {selectedUser.name}
                        </div>

                        <div>
                            <span className="font-medium">Email:</span>{' '}
                            {selectedUser.email}
                        </div>

                        <div>
                            <span className="font-medium">Role:</span>{' '}
                            {selectedUser.role}
                        </div>
                    </>
                )}
            </ModalDetail>

            {/* modal delete */}
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
            title: 'Data Pengguna',
        },
    ],
};