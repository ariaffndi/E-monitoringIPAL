import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    title?: string;
    children: React.ReactNode;
};

export default function ModalDetail({
    open,
    setOpen,
    title = 'Detail',
    children,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 text-sm">{children}</div>
            </DialogContent>
        </Dialog>
    );
}
