import type { AutoResponseDetails } from '@/types/bluetick/db/autores';
import React from 'react';
import { Button } from '@/components/ui/button';

import {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from '@/components/custom-ui/responsive-modal';
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
  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger>
        <Button size={'sm'} variant={'destructive'} className="px-2 rounded-lg">
          Delete
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Delete Confirmation</ResponsiveModalTitle>
          <ResponsiveModalDescription className="flex flex-col gap-2">
            Please confirm that you want to auto-responder
            {selected.length > 1 && 's'} with trigger
            {selected.length > 1 && 's'} below:
            <div className="font-semibold text-foreground">
              {selected.map((e, index) => (
                <span key={index}>- {e.trigger}</span>
              ))}
            </div>
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <ResponsiveModalFooter>
          <ResponsiveModalClose className="flex items-center gap-2">
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
          </ResponsiveModalClose>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default DeleteDialog;
