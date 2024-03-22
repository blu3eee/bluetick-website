'use client';
import React, { useContext } from 'react';
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from '@/config/bluetick';
import { useFetchGuildTicketSetting } from '@/hooks/api/tickets/settings';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { TicketSettingDetails } from '@/types/bluetick/db/tickets';
import { GuildContext } from '@/context/guild-context';
import { Switch } from '@/components/ui/switch';
import { ChannelSelect } from '../../ui/channel-select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { ServerIdProps } from '../props';

const GeneralSettings: React.FC<ServerIdProps> = ({ serverId }) => {
  const {
    data: ticketSetting,
    isLoading,
    refetch,
  } = useFetchGuildTicketSetting(BLUETICK_BOT_ID, serverId);

  const { isLoadingChannels, channels } = useContext(GuildContext);
  const [setting, setSetting] = React.useState<TicketSettingDetails>({
    id: -1,
    bot: {
      id: 0,
      botID: '',
      token: '',
      themeHexColor: '',
      discord_secret: '',
      discord_callback_url: '',
      premiumFlags: 0,
    },
    guild: {
      id: 0,
      guildID: '',
    },
    perUserTicketLimit: 5,
    allowUserToCloseTickets: false,
    ticketCloseConfirmation: false,
  });

  React.useEffect(() => {
    if (ticketSetting) {
      setSetting(ticketSetting);
    }
  }, [ticketSetting]);

  if (isLoading) {
    <div className="flex flex-col w-full gap-4">
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
    </div>;
  }

  if (!ticketSetting) {
    <div className="flex flex-col w-full gap-4">
      error fetching ticket setting
    </div>;
  }

  const handleSettingChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setSetting((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSetting = async (): Promise<void> => {
    try {
      const response = await apiInstance.patch(
        `/${ROUTES.TICKET_SETTINGS}/${BLUETICK_BOT_ID}/${serverId}`,
        setting
      );
      if (response.status === 201 || response.status === 200) {
        await refetch();
        toast.success('Ticket setting saved successfully');
      } else {
        toast.success('Failed to save general ticket setting');
      }
    } catch (e) {
      toast.error(
        'An error happened when trying to save general ticket setting.'
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-secondary p-4 flex gap-4 flex-col max-w-[1024px]">
        <div className="flex gap-4 md:gap-6 lg:gap-8 flex-wrap">
          <div className="flex flex-col gap-4 w-fit">
            <Label
              htmlFor="threadTicket"
              className="text-xs font-bold text-gray-500 uppercase"
            >
              THREAD MODE
            </Label>
            <div className="flex items-center gap-4">
              <Switch
                id="threadTicket"
                size="xs"
                checked={setting.threadTicket}
                onClick={() => {
                  setSetting((prev) => ({
                    ...prev,
                    threadTicket: !prev.threadTicket,
                  }));
                }}
              />
              <span>{setting.threadTicket ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-fit">
            <Label
              htmlFor="per-user-limit"
              className="text-xs font-bold text-gray-500 uppercase"
            >
              PER USER SIMULTANEOUS TICKET LIMIT
            </Label>
            <Input
              id="per-user-limit"
              type="number"
              min={1}
              max={10}
              name="perUserTicketLimit"
              value={setting.perUserTicketLimit}
              onChange={handleSettingChange}
              className="w-fit min-w-[100px]"
            />
          </div>
          <div className="flex flex-col gap-4 w-fit">
            <Label
              htmlFor="allowUserToCloseTickets"
              className="text-xs font-bold text-gray-500 uppercase"
            >
              ALLOW USER TO CLOSE TICKETS
            </Label>
            <div className="flex items-center gap-4">
              <Switch
                id="allowUserToCloseTickets"
                size="xs"
                checked={setting.allowUserToCloseTickets}
                onClick={() => {
                  setSetting((prev) => ({
                    ...prev,
                    allowUserToCloseTickets: !prev.allowUserToCloseTickets,
                  }));
                }}
              />
              <span>{setting.allowUserToCloseTickets ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-fit">
            <Label
              htmlFor="ticketCloseConfirmation"
              className="text-xs font-bold text-gray-500 uppercase"
            >
              TICKET CLOSE CONFIRMATION
            </Label>
            <div className="flex items-center gap-4">
              <Switch
                id="ticketCloseConfirmation"
                size="xs"
                checked={setting.ticketCloseConfirmation}
                onClick={() => {
                  setSetting((prev) => ({
                    ...prev,
                    ticketCloseConfirmation: !prev.ticketCloseConfirmation,
                  }));
                }}
              />
              <span>{setting.ticketCloseConfirmation ? 'Yes' : 'No'}</span>
            </div>
          </div>
          {isLoadingChannels ? (
            <>
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </>
          ) : (
            <>
              <div className="w-fit flex flex-col gap-2">
                <Label
                  htmlFor="ticketNotificationChannel"
                  className="text-xs font-bold text-gray-500 uppercase"
                >
                  Ticket Notification Channel
                </Label>
                <div className="w-fit">
                  <ChannelSelect
                    initChannelId={setting.ticketNotificationChannel ?? ''}
                    options={channels?.textChannels ?? []}
                    onSelect={(newId) => {
                      setSetting((prev) => ({
                        ...prev,
                        ticketNotificationChannel: newId,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="w-fit flex flex-col gap-2">
                <Label
                  htmlFor="transcriptsChannel"
                  className="text-xs font-bold text-gray-500 uppercase"
                >
                  Transcript Channel
                </Label>
                <div className="w-fit">
                  <ChannelSelect
                    initChannelId={setting.transcriptsChannel ?? ''}
                    options={channels?.textChannels ?? []}
                    onSelect={(newId) => {
                      setSetting((prev) => ({
                        ...prev,
                        transcriptsChannel: newId,
                      }));
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div>
          <Button
            size={'sm'}
            onClick={() => {
              handleSaveSetting().catch((e) => {
                console.error(e);
              });
            }}
            disabled={setting === ticketSetting}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
