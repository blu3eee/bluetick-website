import React from 'react';
import type { AutoResponseDetails } from '@/types/bluetick/db/autores';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MessageInfoDetails } from '@/types/bluetick';
import { toast } from 'sonner';
import MessageForm from '../../ui/message-form';
import MessageTypesRadioGroup from '../../ui/message-types';

interface Props {
  editTrigger?: React.ReactNode;
  init: AutoResponseDetails;
  onSubmitUpdate: (
    id: number,
    trigger: string,
    newAutoRes: MessageInfoDetails
  ) => void;
}

const EditResponseDialog: React.FC<Props> = ({
  editTrigger,
  init,
  onSubmitUpdate,
}) => {
  const [response, setResponse] = React.useState<MessageInfoDetails>(
    init.response
  );

  const [trigger, setTrigger] = React.useState(init.trigger);

  const handleSubmit = (): void => {
    if (!trigger) {
      toast.error('Your response trigger is empty');
      return;
    }

    if (!response.embed && !response.content) {
      toast.error('Your response content and embed are empty');
      return;
    }

    onSubmitUpdate(init.id, trigger, response);
  };

  return (
    <Dialog>
      <DialogTrigger>
        {editTrigger ?? <Button size={'sm'}>Edit response</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-[1024px] h-3/4  overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Response</DialogTitle>
          <DialogDescription>
            Edit your existing auto-response
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 flex w-full">
          <div className="flex w-full gap-2">
            <div className="w-full bg-secondary rounded-lg px-2 py-3 flex flex-col gap-2">
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
            <div className="w-full bg-secondary rounded-lg px-2 py-3 flex flex-col gap-2">
              <Label htmlFor="message-type">Message Type</Label>
              <div className="px-2">
                <MessageTypesRadioGroup
                  initType={response.type ?? 'Message'}
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
          <div className="w-full bg-secondary rounded-lg px-4 py-3 flex flex-col gap-2">
            <MessageForm
              type={response.type ?? 'Message'}
              initialMessage={response}
              disabledEmbedFields={['footer']}
              onChange={(newRes) => {
                setResponse(newRes);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" size={'sm'} onClick={handleSubmit}>
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditResponseDialog;
