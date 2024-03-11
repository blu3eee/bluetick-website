'use client';
import React, { useContext } from 'react';
import type { ServerIdProps } from '../props';
import { useFetchTicketPanels } from '@/hooks/api/tickets/reaction-panels';
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from '@/config/bluetick';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { TicketPanelDetails } from '@/types/bluetick/db/tickets';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { GuildContext } from '@/context/guild-context';
import EditPanelDialog from './ui/edit-panel';
import CreatePanelForm from './ui/create-panel';

const ReactionPanels: React.FC<ServerIdProps> = ({ serverId }) => {
  const { data, refetch, isLoading } = useFetchTicketPanels(
    BLUETICK_BOT_ID,
    serverId
  );

  const [panels, setPanels] = React.useState<TicketPanelDetails[]>([]);

  const { channels, isLoadingChannels } = useContext(GuildContext);

  React.useEffect(
    () => {
      if (!isLoading) {
        setPanels(data ?? []);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  const handleCreatePanel = async (): Promise<void> => {
    try {
      await refetch();
    } catch (e) {
      //   console.error(e);
      toast.error('An error happened while creating new reaction panel.');
    }
  };

  const handleDeletePanel = async (id: number): Promise<void> => {
    // send request to create panel here
    const response = await apiInstance.delete(`/${ROUTES.TICKET_PANELS}/${id}`);
    if (response.status === 200 || response.status === 201) {
      toast.success(`Ticket panel deleted ${id}.`);
      await refetch();
    } else {
      toast.error('Failed to delete ticket panel.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-lg bg-secondary p-4">
        <Label className="uppercase font-bold text-gray-500">
          Your Reaction Panels ( <span>{panels.length}</span> / 3)
        </Label>
        {isLoading ? (
          <div className="w-full h-fit">
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
          </div>
        ) : !data ? (
          <div>error fetching reaction panels</div>
        ) : (
          <div className="w-full">
            <Table>
              <TableCaption>
                {panels.length === 0
                  ? 'No panel found'
                  : 'A list of your reaction panels.'}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[128px]">Channel</TableHead>
                  <TableHead>Panel Title</TableHead>
                  <TableHead>Panel Button</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {panels.map((panel) => (
                  <TableRow key={panel.id}>
                    <TableCell className="font-medium">
                      <a
                        href={`https://discord.com/channels/${serverId}/${panel.channelID}`}
                        className="px-2 py-1 bg-gray-600 rounded-md"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {isLoadingChannels || !channels
                          ? 'loading...'
                          : channels.textChannels.find(
                              (c) => c.id === panel.channelID
                            )?.name
                          ? `#${
                              channels.textChannels.find(
                                (c) => c.id === panel.channelID
                              )?.name
                            }`
                          : panel.channelID}
                      </a>
                    </TableCell>
                    <TableCell>
                      {panel.message?.embed?.title ?? 'empty title'}
                    </TableCell>
                    <TableCell>{panel.button.text ?? '[none]'}</TableCell>
                    <TableCell className="flex justify-end items-center gap-2">
                      <EditPanelDialog
                        panel={panel}
                        trigger={
                          <div className="text-white px-2 py-1 rounded-md font-semibold bg-blue-500">
                            Edit
                          </div>
                        }
                        refetch={() => {
                          refetch().catch((e) => {
                            console.log(e);
                          });
                        }}
                      />
                      <div
                        className="text-white px-2 py-1 rounded-md font-semibold bg-destructive cursor-pointer"
                        onClick={() => {
                          handleDeletePanel(panel.id).catch((e) => {
                            console.log(e);
                          });
                        }}
                      >
                        Delete
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 rounded-lg bg-secondary p-4 ">
        <Label className="uppercase font-bold text-gray-500">
          Create Panel
        </Label>
        {panels.length < 3 ? (
          <CreatePanelForm
            serverId={serverId}
            handleCreatePanel={() => {
              handleCreatePanel().catch((e) => {
                console.error(e);
                console.error('an error happened while trying to create panel');
              });
            }}
          />
        ) : (
          <div className="text-md text-gray-500">
            Your server reached limit{' '}
            <span className="text-blue-500 font-bold">{panels.length}</span> /
            3. You can delete existing panel(s) to create new ones.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactionPanels;
