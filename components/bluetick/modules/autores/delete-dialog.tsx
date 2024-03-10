import type { AutoResponseDetails } from '@/types/bluetick/db/autores';
import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
interface DeleteDialogProps {
  selected: AutoResponseDetails[];
  onDelete: () => void;
  onCancel?: () => void;
}

/**
 * Displays a responsive dialog or drawer for delete confirmation,
 * depending on the screen size. It uses a media query to determine
 * the screen width and chooses the appropriate UI component accordingly.
 * @param {{ selected: AutoResponseDetails[]; onDelete: () => void; onCancel?: () => void; }} props The props for the DeleteDialog component.
 * @returns {React.ReactElement | null} A Dialog or Drawer component for delete confirmation.
 */
const DeleteDialog: React.FC<DeleteDialogProps> = ({
  selected,
  onDelete,
  onCancel,
}) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button
            size={'sm'}
            variant={'destructive'}
            className="px-2 rounded-lg"
          >
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogDescription className="flex flex-col gap-2">
              Please confirm that you want to auto-responder
              {selected.length > 1 && 's'} with trigger
              {selected.length > 1 && 's'} below:
              <div className="font-semibold text-foreground">
                {selected.map((e, index) => (
                  <span key={index}>- {e.trigger}</span>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose className="flex items-center gap-2">
              {onCancel && (
                <Button
                  size={'sm'}
                  variant={'secondary'}
                  className="px-2 rounded-lg"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              <Button
                size={'sm'}
                variant={'destructive'}
                className="px-2 rounded-lg"
                onClick={onDelete}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Button size={'sm'} variant={'destructive'} className="px-2 rounded-lg">
          Delete
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Delete Confirmation</DrawerTitle>
          <DrawerDescription>
            Please confirm that you want to auto-responder
            {selected.length > 1 && 's'} with trigger
            {selected.length > 1 && 's'} below:
            <div className="font-semibold text-foreground">
              {selected.map((e, index) => (
                <span key={index}>- {e.trigger}</span>
              ))}
            </div>
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <div className="gap-2 flex flex-col items-center justify-end">
              <Button
                size={'sm'}
                variant={'destructive'}
                className="px-2 rounded-lg w-full"
                onClick={onDelete}
              >
                Confirm
              </Button>
              {onCancel && (
                <Button
                  size={'sm'}
                  variant={'secondary'}
                  className="w-full"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeleteDialog;
