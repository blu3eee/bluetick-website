'use client';
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from '@/config/bluetick';
import { GuildContext } from '@/context/guild-context';
import type {
  TicketMultiPanelDetails,
  UpdateTicketMultiPanelDto,
} from '@/types/bluetick/db/tickets';
import React, { useContext } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useFetchTicketPanels } from '@/hooks/api/tickets/reaction-panels';
import MessageForm from '@/components/bluetick/ui/message-form';
import MultiSelectPanels from './panels-select';
import { ChannelSelect } from '@/components/bluetick/ui/channel-select';
import MessagePreview from '../../../ui/message-preview';

interface EditPanelDialogProps {
  panel: TicketMultiPanelDetails;
  trigger?: React.ReactNode;
  refetch?: () => void;
}

const EditMultiPanelDialog: React.FC<EditPanelDialogProps> = ({
  panel,
  trigger,
  refetch,
}) => {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<UpdateTicketMultiPanelDto>({
    panelsIDs: panel.panels.map((p) => p.id.toString()),
  });
  const { discordGuild, channels, isLoadingChannels } =
    useContext(GuildContext);

  const {
    data: panels,

    isLoading: isLoadingPanels,
  } = useFetchTicketPanels(BLUETICK_BOT_ID, discordGuild?.id ?? '');

  const handleUpdate = async (): Promise<void> => {
    console.log(form);
    const missings: string[] = [];

    if (form.channelID && form.channelID === '') {
      missings.push('panel channel');
    }
    if (form.message?.embed?.title === '') {
      missings.push('panel message title');
    }

    if (missings.length > 0) {
      toast.error(`Missing fields:\n${missings.join(', ')}`);
      return;
    }

    // send request to create panel here
    const response = await apiInstance.patch(
      `/${ROUTES.TICKET_MULTI_PANELS}/${panel.id}`,
      form
    );

    if (response.status === 200 || response.status === 201) {
      toast.success('Multi-reactions panel updated.');
      if (refetch) {
        refetch();
      }
    } else {
      toast.error('Failed to update multi-reactions  ticket panel.');
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger ?? 'Edit'}</DialogTrigger>
      <DialogContent className="max-w-[1024px] h-3/4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit multi-reactions ticket panel: (id){' '}
            <span className="text-blue-500">{panel.id}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 flex w-full h-fit justify-start">
          <div className="flex flex-col md:flex-row gap-2 items-start md:items:center ">
            <div className="flex flex-col gap-2 w-fit">
              <Label className="uppercase font-semibold text-gray-500 text-xs">
                Panel Channel
              </Label>
              {!isLoadingChannels && channels ? (
                <ChannelSelect
                  options={channels.textChannels}
                  initChannelId={panel.channelID}
                  onSelect={(newId: string) => {
                    setForm((prev) => ({
                      ...prev,
                      channelID: newId,
                    }));
                  }}
                />
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label className="uppercase font-semibold text-gray-500 text-xs">
                Selected Panels
              </Label>
              {!isLoadingPanels && panels ? (
                <MultiSelectPanels
                  options={panels}
                  selectedMentions={form.panelsIDs ?? []}
                  onMentionsChange={(newVal) => {
                    setForm((prev) => ({
                      ...prev,
                      panelsIDs: newVal,
                    }));
                  }}
                />
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </div>
          </div>
          <div>
            <MessageForm
              type="Embed and Text"
              initialMessage={panel.message}
              onChange={(msg) => {
                setForm((prev) => ({
                  ...prev,
                  message: msg,
                }));
              }}
              disabledEmbedFields={['footer']}
              showPreview={false}
            />
          </div>
          <div>
            <MessagePreview
              type={'Embed and Text'}
              message={{ ...panel.message, ...form.message }}
              buttons={panels
                ?.filter((p) => (form.panelsIDs ?? []).includes(String(p.id)))
                .map((p) => p.button)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              onClick={() => {
                handleUpdate().catch((e) => {
                  console.error(e);
                  console.error(
                    'Error happened while handling update multi-reactions panel'
                  );
                });
              }}
            >
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMultiPanelDialog;
