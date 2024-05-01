"use client";
import React, { useContext } from "react";
import type { ServerIdProps } from "../props";
import { Label } from "@/components/ui/label";
import { useFetchTicketMultiPanels } from "@/hooks/api/tickets/multi-panels";
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from "@/config/bluetick";
import type { TicketMultiPanelDetails } from "@/types/bluetick/db/tickets";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import EditMultiPanelDialog from "./ui/edit-multi-panel";
import { GuildContext } from "@/context/guild-context";
import CreateMultiPanelForm from "./ui/create-multi-panel";
import { Button } from "@/components/ui/button";

const MultiReactionsPanels: React.FC<ServerIdProps> = ({ serverId }) => {
  const {
    data,
    refetch,
    isLoading: isLoadingPanels,
  } = useFetchTicketMultiPanels(BLUETICK_BOT_ID, serverId);

  const [panels, setPanels] = React.useState<TicketMultiPanelDetails[]>([]);

  const { channels, isLoadingChannels } = useContext(GuildContext);

  React.useEffect(() => {
    setPanels(data ?? []);
  }, [data]);

  const handleDeletePanel = async (id: number): Promise<void> => {
    // send request to create panel here
    const response = await apiInstance.delete(
      `/${ROUTES.TICKET_MULTI_PANELS}/${id}`,
    );
    if (response.status === 200 || response.status === 201) {
      toast.success(`Multi-reactions ticket panel deleted ${id}.`);
      await refetch();
    } else {
      toast.error("Failed to delete multi-reactions ticket panel.");
    }
  };

  const handleCreatePanel = async (): Promise<void> => {
    await refetch();
  };

  const handeResendPanel = async (id: number): Promise<void> => {
    try {
      const { data } = await apiInstance.post<{
        data: { message: string; url: string };
      }>(`${ROUTES.TICKET_MULTI_PANELS}/send/${id}`);
      if (data.data) {
        const resData = data.data;
        toast.success(resData.message);
      } else {
        toast.error(`Failed to resend ticket panel message`);
      }
    } catch {
      toast.error(`An error happened while trying to resend the panel`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-lg bg-secondary p-4">
        <Label className="uppercase font-bold text-gray-500">
          Your Multi-Reactions Panels
        </Label>
        {isLoadingPanels ? (
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
                  ? "No panel found"
                  : "A list of your multi-reactions panels."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Channel</TableHead>
                  <TableHead>Panel Title</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Panel Reactions
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {panels.map((panel) => (
                  <TableRow key={panel.id}>
                    <TableCell className="font-medium">
                      <a
                        href={`https://discord.com/channels/${serverId}/${panel.channelID}`}
                        className="px-2 py-1 bg-discord/70 text-white rounded-md"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {isLoadingChannels || !channels
                          ? "loading..."
                          : channels.textChannels.find(
                                (c) => c.id === panel.channelID,
                              )?.name
                            ? `#${
                                channels.textChannels.find(
                                  (c) => c.id === panel.channelID,
                                )?.name
                              }`
                            : panel.channelID}
                      </a>
                    </TableCell>
                    <TableCell>
                      {panel.message?.embed?.title ?? "empty title"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {panel.panels.map((p) => p.button.text).join(", ")}
                    </TableCell>

                    <TableCell className="flex justify-end items-center gap-2">
                      <Button
                        size={"xs"}
                        variant={"warning"}
                        onClick={() => {
                          handeResendPanel(panel.id).catch((e) => {});
                        }}
                      >
                        Resend
                      </Button>
                      <EditMultiPanelDialog
                        panel={panel}
                        trigger={
                          <Button size={"xs"} variant={"info"}>
                            Edit
                          </Button>
                        }
                        refetch={() => {
                          refetch().catch((e) => {
                            console.error(e);
                          });
                        }}
                      />
                      <Button
                        size={"xs"}
                        variant={"error"}
                        onClick={() => {
                          handleDeletePanel(panel.id).catch((e) => {
                            console.error(e);
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 rounded-lg bg-secondary p-4">
        <Label className="uppercase font-bold text-gray-500">
          Create Multi-reactions Panel
        </Label>
        {panels.length < 2 ? (
          <CreateMultiPanelForm
            serverId={serverId}
            handleCreatePanel={() => {
              handleCreatePanel().catch((e) => {
                console.error(e);
              });
            }}
          />
        ) : (
          <div className="text-md text-gray-500">
            Your server reached limit{" "}
            <span className="text-blue-500 font-bold">{panels.length}</span> /
            2. You can delete existing panel(s) to create new ones.
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiReactionsPanels;
