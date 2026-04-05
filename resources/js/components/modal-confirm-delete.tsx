import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    title?: string;
    description?: string;
    onConfirm: () => void;
    processing?: boolean;
};

export default function ModalConfirmDelete({
    open,
    setOpen,
    title = 'Konfirmasi',
    description = 'Apakah kamu yakin?',
    onConfirm,
    processing = false,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">{description}</p>

                <DialogFooter>
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Batal
                    </Button>

                    <Button
                        className="cursor-pointer"
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={processing}
                    >
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
