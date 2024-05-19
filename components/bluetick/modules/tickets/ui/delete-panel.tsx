import {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/custom-ui/responsive-modal";
import { Button } from "@/components/ui/button";
import React from "react";

interface Props {
  panelId: number;
  trigger: React.ReactNode;
  onSubmit: () => void;
}
const DeletePanelDialog: React.FC<Props> = ({ panelId, trigger, onSubmit }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger>{trigger}</ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Confirmation to delete</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Confirming that you want to delete reaction panel with ID {panelId}
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <div className="ml-4 text-sm font-medium text-foreground md:ml-0">
          This action will result in deleting related multi-reactions panels if:
          <div className="ml-4 text-foreground/70">
            <span>
              - The mutli-reaction panel will have less than 2 panels after
              deleting this panel
            </span>
          </div>
        </div>
        <ResponsiveModalFooter>
          <ResponsiveModalClose className="flex gap-2 self-end">
            <Button variant={"secondary"}>Cancel</Button>
            <Button
              variant={"warning"}
              onClick={() => {
                onSubmit();
              }}
            >
              Confirm
            </Button>
          </ResponsiveModalClose>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default DeletePanelDialog;
