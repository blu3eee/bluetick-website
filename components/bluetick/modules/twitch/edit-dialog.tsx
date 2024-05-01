import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { MessageInfoDetails } from "@/types/bluetick";
import { Button } from "@/components/ui/button";
import MessageForm from "@/components/bluetick/ui/message-form";
import { CollapsibleFields } from "@/components/bluetick/ui/collapsible-fields";
import { PlaceholdersHelpBox } from "@/components/bluetick/ui/placeholder";
import { twitchPlaceholders } from ".";

interface Props {
  message: MessageInfoDetails;
  onSubmit: (msg: MessageInfoDetails) => void;
  placeholders: Record<string, string>;
}
const EditNotificationDialog: React.FC<Props> = ({
  message,
  onSubmit,
  placeholders,
}) => {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<MessageInfoDetails>(message);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size={"sm"} variant={"info"}>
          Edit Notification Message
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1024px] h-3/4">
        <DialogHeader>
          <DialogTitle>Edit Twitch Live Notification</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 flex w-full justify-start overflow-y-auto">
          <div className="pl-6">
            <MessageForm
              type={message.type ?? "Embed and Text"}
              initialMessage={message}
              disabledEmbedFields={["footer"]}
              onChange={(newMsg) => {
                setForm((prev) => ({
                  ...prev,
                  ...newMsg,
                }));
              }}
              placeholders={placeholders}
            />
          </div>
          <CollapsibleFields label={"Variables References"} defaultOpen={false}>
            <div className="pl-6">
              <PlaceholdersHelpBox placeholders={twitchPlaceholders} />
            </div>
          </CollapsibleFields>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button
              onClick={() => {
                onSubmit(form);
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNotificationDialog;
