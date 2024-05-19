import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React from "react";
import MessageTypesRadioGroup from "../../ui/message-types";
import MessageForm from "../../ui/message-form";
import type { MessageInfoDetails } from "@/types/bluetick";
import { toast } from "sonner";

interface AddResponseDialogProps {
  onSubmit: (trigger: string, response: MessageInfoDetails) => void;
}

export const AddResponseDialog: React.FC<AddResponseDialogProps> = ({
  onSubmit,
}) => {
  const [response, setResponse] = React.useState<MessageInfoDetails>({
    type: "Message",
  });

  const [trigger, setTrigger] = React.useState("");

  const handleCreateSubmit = (): void => {
    if (!trigger) {
      toast.error("Your response trigger is empty");
      return;
    }

    if (!response.embed && !response.content) {
      toast.error("Your response content and embed are empty");
      return;
    }

    onSubmit(trigger, response);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Add response</Button>
      </DialogTrigger>
      <DialogContent className="h-3/4 max-w-[1024px]">
        <DialogHeader>
          <DialogTitle>Add new response</DialogTitle>
          <DialogDescription>
            Add a new auto-response for your guild
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex w-full flex-col gap-2 overflow-y-auto">
          <div className="flex w-full gap-2">
            <div className="flex w-full flex-col gap-2 rounded-lg bg-secondary px-2 py-3">
              <Label htmlFor="trigger">Trigger</Label>
              <Input
                id="trigger"
                placeholder="Trigger for your auto-res"
                value={trigger}
                onChange={(e) => {
                  const { value } = e.target;
                  setTrigger(value);
                }}
              />
            </div>
            <div className="flex w-full flex-col gap-2 rounded-lg bg-secondary px-2 py-3">
              <Label htmlFor="message-type">Message Type</Label>
              <div className="px-2">
                <MessageTypesRadioGroup
                  initType={response.type ?? "Message"}
                  onValueChange={(newValue) => {
                    setResponse((prev) => ({
                      ...prev,
                      type: newValue,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-lg bg-secondary px-4 py-3">
            <MessageForm
              type={response.type ?? "Message"}
              initialMessage={response}
              disabledEmbedFields={["footer"]}
              onChange={(newRes) => {
                setResponse(newRes);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <div className="grid grid-cols-2 gap-2">
              <Button size={"sm"}>Cancel</Button>
              <Button
                type="submit"
                variant={"success"}
                size={"sm"}
                onClick={handleCreateSubmit}
              >
                Create
              </Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
