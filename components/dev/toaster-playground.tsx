import React from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const ToastPlayground = (): JSX.Element => {
  const toastContent = {
    title: 'Event has been created',
    content: {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        label: 'Undo',
        onClick: () => {
          console.log('Undo');
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          console.log('Cancel!');
        },
      },
    },
  };
  return (
    <div className="flex flex-col gap-8">
      <div className="p-4 rounded-lg bg-secondary flex flex-col gap-4">
        <Label className="font-bold">toast (sonner) </Label>
        <div className="flex flex-wrap gap-4">
          <Button
            size={'sm'}
            onClick={() => {
              toast(toastContent.title, toastContent.content);
            }}
          >
            regular
          </Button>
          <Button
            size={'sm'}
            variant={'success'}
            onClick={() => {
              toast.success(toastContent.title, toastContent.content);
            }}
          >
            success
          </Button>
          <Button
            size={'sm'}
            variant={'error'}
            onClick={() => {
              toast.error(toastContent.title, toastContent.content);
            }}
          >
            error
          </Button>
          <Button
            size={'sm'}
            variant={'warning'}
            onClick={() => {
              toast.warning(toastContent.title, toastContent.content);
            }}
          >
            warning
          </Button>
          <Button
            size={'sm'}
            variant={'info'}
            onClick={() => {
              toast.info(toastContent.title, toastContent.content);
            }}
          >
            info
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToastPlayground;
