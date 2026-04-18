import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { PlusCircle, Search, MoreVertical, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

export default function Users({ users }: { users: User[] }) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'operator', // 🔒 dikunci
        password: '',
    });

    // ================= CREATE =================
    const handleCreate = () => {
        post('/users', {
            onSuccess: () => {
                setOpenCreate(false);
                reset();
                toast.success('User berhasil ditambahkan');
            },
        });
    };

    // ================= DETAIL =================
    const handleView = (user: User) => {
        setSelectedUser(user);
        setOpenDetail(true);
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
            router.get('/users', {}, { preserveState: true });
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
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <Button
                        onClick={() => setOpenCreate(true)}
                        className="mb-2 w-fit cursor-pointer bg-blue-600 hover:bg-blue-700 sm:mb-0"
                    >
                        <PlusCircle />
                        Tambah Operator
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

                {/* CARD LIST */}
                <div className="grid gap-8 p-6 sm:grid-cols-2 md:grid-cols-2">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="relative cursor-pointer rounded-xl border p-4 shadow-sm transition hover:shadow-md"
                            onClick={() => handleView(user)}
                        >
                            {/* DROPDOWN */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="absolute top-2 right-2 cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreVertical size={16} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDelete(user.id);
                                        }}
                                        className="cursor-pointer text-red-500 focus:text-red-500"
                                    >
                                        <Trash2
                                            size={16}
                                            className="text-danger mr-2"
                                        />
                                        Hapus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* CONTENT */}
                            <div className="flex items-center gap-3">
                                {/* AVATAR */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                                    {getInitial(user.name)}
                                </div>

                                {/* INFO */}
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL CREATE */}
            <ModalCreate
                open={openCreate}
                setOpen={setOpenCreate}
                title="Tambah Operator"
                onSubmit={handleCreate}
                processing={processing}
            >
                <Input
                    placeholder="Nama"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                />
                {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                )}

                <Input
                    placeholder="Email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                />
                {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                )}

                {/* ROLE DIKUNCI */}
                <Input value="Operator" disabled />

                <Input
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setData('password', e.target.value)}
                />
                {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                )}
            </ModalCreate>

            {/* MODAL DETAIL */}
            <ModalDetail
                open={openDetail}
                setOpen={setOpenDetail}
                title="Detail User"
            >
                {selectedUser && (
                    <>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 mt-2">
                            {getInitial(selectedUser.name)}
                        </div>
                        <p>
                            <b>Nama:</b> {selectedUser.name}
                        </p>
                        <p>
                            <b>Email:</b> {selectedUser.email}
                        </p>
                        <p>
                            <b>Role:</b> {selectedUser.role}
                        </p>
                    </>
                )}
            </ModalDetail>

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
            title: 'Data Operator',
        },
    ],
};
