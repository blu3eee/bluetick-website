import React, { useContext } from "react";
import type { ServerIdProps } from "../props";
import { GuildContext } from "@/context/guild-context";
import type { BotGuildActionLogDetails } from "@/types/bluetick/db/bot-logs/action-logs";
import { useFetchGuildActionLogs } from "@/hooks/api/bot-logs/action-logs";
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from "@/config/bluetick";
import { Label } from "@/components/ui/label";
import { setCharAt } from "./bot-logs";
import { toast } from "sonner";
import { CollapsibleFields } from "../../ui/collapsible-fields";
import { logsCollection } from "./constants";
import { cn } from "@/lib/utils";
import { ChannelSelect } from "../../ui/channel-select";
import { Skeleton } from "@/components/ui/skeleton";

const SpecifiedLogChannels: React.FC<ServerIdProps> = ({ serverId }) => {
  const { channels, isLoadingChannels } = useContext(GuildContext);
  const [actionLogsRecord, setActionLogsRecord] = React.useState<
    Record<string, BotGuildActionLogDetails>
  >({});

  const newLogActionEvents = "".padEnd(60, "0");
  const [actionLogs, setActionLogs] = React.useState<
    BotGuildActionLogDetails[]
  >([]);

  const { data, refetch } = useFetchGuildActionLogs(BLUETICK_BOT_ID, serverId);
  React.useEffect(() => {
    if (data) {
      setActionLogs(data);
      const records: Record<string, BotGuildActionLogDetails> = {};
      for (const actionLog of data) {
        records[actionLog.channelID] = actionLog;
      }
      setActionLogsRecord(records);
    }
  }, [data]);
  const handleSelectChannel = async (
    channelID: string,
    eventName: string,
    index: number,
  ): Promise<void> => {
    // turn off the bit on the existing record first
    const existRecord = actionLogs.find(
      (actionLog) => actionLog.events[index] === "1",
    );
    if (existRecord) {
      existRecord.events = setCharAt(existRecord.events, index, "0");
      const { data } = await apiInstance.patch<{
        data: BotGuildActionLogDetails;
      }>(`${ROUTES.ACTION_LOGS}/${existRecord.id}`, {
        events: existRecord.events,
      });
      if (data.data) {
        const newActionLogs = actionLogs.filter(
          (a) => a.id !== existRecord?.id,
        );
        newActionLogs.push(data.data);
        setActionLogs(newActionLogs);
        actionLogsRecord[channelID] = data.data;
      }
    }

    if (actionLogsRecord[channelID]) {
      const actionLog = actionLogsRecord[channelID];
      // turn on by changing the exist record
      actionLog.events = setCharAt(actionLog.events, index, "1");
      const { data } = await apiInstance.patch<{
        data: BotGuildActionLogDetails;
      }>(`${ROUTES.ACTION_LOGS}/${actionLog.id}`, { events: actionLog.events });
      if (data.data) {
        const newActionLogs = actionLogs.filter((a) => a.id !== actionLog.id);
        newActionLogs.push(data.data);
        setActionLogs(newActionLogs);
        // actionLogsRecord[channelID] = data.data;
        setActionLogsRecord((prev) => ({ ...prev, channelID: data.data }));
        toast.success(`${eventName} enabled`);
      } else {
        toast.error(`Failed to enable ${eventName}`);
      }
    } else {
      // turn on by creating new record
      const { data } = await apiInstance.post<{
        data: BotGuildActionLogDetails;
      }>(`${ROUTES.ACTION_LOGS}`, {
        botID: BLUETICK_BOT_ID,
        guildID: serverId,
        channelID,
        events: setCharAt(newLogActionEvents, index, "1"),
      });
      if (data.data) {
        setActionLogs([...actionLogs, data.data]);
        setActionLogsRecord((prev) => ({ ...prev, channelID: data.data }));
        toast.success(`${eventName} enabled`);
      } else {
        toast.error(`Failed to enable ${eventName}`);
      }
    }
    await refetch();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-lg bg-secondary p-4">
        <Label className="font-semibold uppercase">Log Channel</Label>
        <span className="text-sm text-foreground/50">
          Where the events selected below will be logged.
        </span>
        {logsCollection.map((category, i) => (
          <CollapsibleFields
            key={i}
            label={`${category.category} Events`}
            defaultOpen={true}
          >
            <div className="grid grid-cols-2 gap-x-2 gap-y-2 md:grid-cols-3 lg:grid-cols-4">
              {category.events.map((e) => {
                const eventName = e.event
                  .split("_")
                  .map(
                    (word) =>
                      word[0].toUpperCase() + word.substring(1).toLowerCase(),
                  )
                  .join(" ");

                const index = category.value * 10 + e.value;
                let selectedChannel = ``;
                for (const actionLog of actionLogs) {
                  if (actionLog.events[index] === "1") {
                    selectedChannel = actionLog.channelID;
                    break;
                  }
                }
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-1 text-foreground/50"
                  >
                    <Label
                      htmlFor={`${category.category}_${eventName}`}
                      className={cn("text-sm text-foreground/90")}
                    >
                      {eventName}
                    </Label>
                    {!channels || isLoadingChannels ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <ChannelSelect
                        options={channels.textChannels}
                        initChannelId={selectedChannel}
                        onSelect={(id) => {
                          handleSelectChannel(id, eventName, index).catch(
                            (e) => {},
                          );
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CollapsibleFields>
        ))}
      </div>
    </div>
  );
};

export default SpecifiedLogChannels;
