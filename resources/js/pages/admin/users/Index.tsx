import { Head } from '@inertiajs/react';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

export default function Users({ users }: any) {
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setSelectedId(id);
        setOpen(true);
    };

    const handleDelete = () => {
        if (selectedId) {
            router.delete(`/admin/users/${selectedId}`, {
                onSuccess: () => setOpen(false),
            });
        }
    };

    return (
        <>
            <Head title="Users" />

            <div className="flex flex-col gap-4 p-4">
                <Link href="/users/create">
                    <Button>Tambah User</Button>
                </Link>
                {/* TABLE */}
                <div className="rounded border p-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 text-left">Nama</th>
                                <th className="p-2 text-left">Email</th>
                                <th className="p-2 text-left">Role</th>
                                <th className="p-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user: any) => (
                                <tr key={user.id} className="border-b">
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2">{user.email}</td>
                                    <td className="p-2">{user.role}</td>
                                    <td className="p-2">
                                        <Button
                                            variant="destructive"
                                            onClick={() => confirmDelete(user.id)}
                                        >
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DELETE */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus User?</DialogTitle>
                    </DialogHeader>

                    <p>Apakah kamu yakin ingin menghapus user ini?</p>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Users.layout = {
    breadcrumbs: [
        {
            title: 'Users',
        },
    ],
};
