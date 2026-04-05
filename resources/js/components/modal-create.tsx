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
   title: string;
   onSubmit: () => void;
   processing?: boolean;
   children: React.ReactNode;
};

export default function ModalCreate({
   open,
   setOpen,
   title,
   onSubmit,
   processing = false,
   children,
}: Props) {
   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogContent>
               <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>

               <div className="space-y-4">{children}</div>

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
                     onClick={onSubmit}
                     disabled={processing}
                  >
                     Simpan
                  </Button>
               </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
