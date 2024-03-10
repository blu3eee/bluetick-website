import { ChannelSelect } from '@/components/bluetick/ui/channel-select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from '@/config/bluetick';
import { GuildContext } from '@/context/guild-context';
import { useFetchTicketPanels } from '@/hooks/api/tickets/reaction-panels';
import type { CreateTicketMultiPanelDto } from '@/types/bluetick/db/tickets';
import React, { useContext } from 'react';
import MultiSelectPanels from './panels-select';
import MessageForm from '@/components/bluetick/ui/message-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SquarePen } from 'lucide-react';

interface CreateMultiPanelProps {
  serverId: string;
  handleCreatePanel: () => void;
}

const CreateMultiPanelForm: React.FC<CreateMultiPanelProps> = ({
  serverId,
  handleCreatePanel,
}) => {
  const [form, setForm] = React.useState<CreateTicketMultiPanelDto>({
    botID: BLUETICK_BOT_ID,
    guildID: serverId,
    channelID: '',
    message: { type: 'Embed and Text', content: '' },
    panelsIDs: [],
  });

  const { channels, isLoadingChannels } = useContext(GuildContext);

  const { data: panels, isLoading: isLoadingPanels } = useFetchTicketPanels(
    BLUETICK_BOT_ID,
    serverId
  );

  const handleCreateSubmit = async (): Promise<void> => {
    try {
      console.log(form);
      const missings: string[] = [];
      if (form.channelID === '') {
        missings.push('panel channel');
      }
      if (!form.message.embed || form.message.embed?.title === '') {
        missings.push('panel title');
      }
      if (form.panelsIDs.length < 2) {
        missings.push('select at least 2 panels');
      }
      if (missings.length !== 0) {
        toast.error(`Missing fields: ${missings.join(', ')}`);
        return;
      }
      const response = await apiInstance.post(
        `${ROUTES.TICKET_MULTI_PANELS}`,
        form
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('New multi-reactions ticket panel created.');
        handleCreatePanel();
      }
    } catch (e) {
      toast.error(
        'An error happened while trying to create new multi-reactions ticket panel'
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <MessageForm
          type="Embed and Text"
          initialMessage={form.message}
          onChange={(msg) => {
            setForm((prev) => ({
              ...prev,
              message: msg,
            }));
          }}
          disabledEmbedFields={['footer']}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-2 items-start md:items:center ">
        <div className="flex flex-col gap-2 w-fit">
          <Label className="uppercase font-semibold text-gray-500 text-xs">
            Panel Channel
          </Label>
          {!isLoadingChannels && channels ? (
            <ChannelSelect
              options={channels.textChannels}
              initChannelId={''}
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
              selectedMentions={form.panelsIDs}
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
        <Button
          size={'sm'}
          onClick={() => {
            handleCreateSubmit().catch((e) => {
              console.log(e);
            });
          }}
          className="gap-2"
        >
          <SquarePen size={18} />
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateMultiPanelForm;
