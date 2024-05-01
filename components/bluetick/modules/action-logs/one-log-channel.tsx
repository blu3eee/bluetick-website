import { GuildContext } from "@/context/guild-context";
import React, { useContext } from "react";
import type { ServerIdProps } from "../props";
import { Label } from "@/components/ui/label";
import { ChannelSelect } from "../../ui/channel-select";
import { Skeleton } from "@/components/ui/skeleton";
import { CollapsibleFields } from "../../ui/collapsible-fields";
import { logsCollection } from "./constants";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useFetchGuildActionLogs } from "@/hooks/api/bot-logs/action-logs";
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from "@/config/bluetick";
import type { BotGuildActionLogDetails } from "@/types/bluetick/db/bot-logs/action-logs";
import { cn } from "@/lib/utils";
import { setCharAt } from "./bot-logs";

const OneLogChannel: React.FC<ServerIdProps> = ({ serverId }) => {
  const { channels, isLoadingChannels } = useContext(GuildContext);
  const [selectedChannel, setSelectedChannel] = React.useState("");
  const [logEvents, setLogEvents] = React.useState("".padEnd(60, "0"));
  const [actionLog, setActionLog] =
    React.useState<BotGuildActionLogDetails | null>(null);

  const [isUpdating, setIsUpdating] = React.useState(false);

  const { data: actionLogs, refetch } = useFetchGuildActionLogs(
    BLUETICK_BOT_ID,
    serverId,
  );

  React.useEffect(() => {
    if (actionLogs) {
      if (actionLogs.length >= 1) {
        setActionLog(actionLogs[0]);
        setSelectedChannel(actionLogs[0].channelID);
        setLogEvents(actionLogs[0].events);
      }
    }
  }, [actionLogs]);

  const handleSelectEvent = async (
    eventName: string,
    index: number,
  ): Promise<void> => {
    setIsUpdating(true);
    try {
      if (selectedChannel === ``) {
        toast.error(`Select a log channel`);
        return;
      }
      if (!actionLog) {
        toast.error(
          `Error modifying action log (no action log found for this server)`,
        );
        return;
      }
      eventName = eventName
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(" ");
      const wasEnabled = logEvents[index] === "1";
      const newLogEvents = setCharAt(logEvents, index, wasEnabled ? "0" : "1");
      const { data } = await apiInstance.patch<{
        data: BotGuildActionLogDetails;
      }>(`${ROUTES.ACTION_LOGS}/${actionLog.id}`, {
        events: newLogEvents,
      });
      if (data.data) {
        await refetch();
        setActionLog(data.data);
        setLogEvents(data.data.events);
        toast.success(`${eventName} ${wasEnabled ? "disabled" : "enabled"}`);
      } else {
        toast.error(
          `Failed to ${
            wasEnabled ? "disabled" : "enabled"
          } log for ${eventName}`,
        );
      }
    } catch (e) {
      console.error(e);
      toast.error(`An error happened while trying to update action logs`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChannelSelect = async (id: string): Promise<void> => {
    try {
      const newChannelId = id === selectedChannel ? "" : id;
      setSelectedChannel(newChannelId);
      if (!actionLog) {
        const { data } = await apiInstance.post<{
          data: BotGuildActionLogDetails;
        }>(`${ROUTES.ACTION_LOGS}`, {
          botID: BLUETICK_BOT_ID,
          guildID: serverId,
          channelID: newChannelId,
          events: logEvents,
        });
        if (data.data) {
          setActionLog(data.data);
          toast.success(`Log channel updated`);
        } else {
          toast.error(`Failed to update log channel`);
        }
      } else {
        const { data } = await apiInstance.patch<{
          data: BotGuildActionLogDetails;
        }>(`${ROUTES.ACTION_LOGS}/${actionLog.id}`, {
          channelID: newChannelId,
        });
        if (data.data) {
          setActionLog(data.data);
          toast.success(`Log channel updated`);
        } else {
          toast.error(`Failed to update log channel`);
        }
      }
    } catch (e) {
      toast.error(`Error trying to update log channel`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-secondary rounded-lg p-4 flex flex-col gap-4">
        <Label className="uppercase font-semibold">Log Channel</Label>
        <span className="text-foreground/50 text-sm">
          Where the events selected below will be logged.
        </span>
        {isLoadingChannels || !channels ? (
          <Skeleton className="w-full h-10" />
        ) : (
          <ChannelSelect
            options={channels.textChannels}
            initChannelId={selectedChannel}
            onSelect={(id: string) => {
              handleChannelSelect(id).catch((e) => {});
            }}
          />
        )}
      </div>
      <div className="bg-secondary rounded-lg p-4 flex flex-col gap-4">
        <span className="text-foreground/80 text-sm">
          Choose which events will be logged.
        </span>
        {logsCollection.map((category, i) => (
          <CollapsibleFields
            key={i}
            label={`${category.category} Events`}
            defaultOpen={true}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-2 gap-x-2">
              {category.events.map((e) => {
                const eventName = e.event
                  .split("_")
                  .map(
                    (word) =>
                      word[0].toUpperCase() + word.substring(1).toLowerCase(),
                  )
                  .join(" ");

                const index = category.value * 10 + e.value;
                return (
                  <div
                    key={index}
                    className="text-foreground/50 flex items-center gap-2"
                  >
                    <Checkbox
                      id={`${category.category}_${eventName}`}
                      checked={logEvents[index] === "1"}
                      onClick={() => {
                        handleSelectEvent(eventName, index).catch((e) => {});
                      }}
                      disabled={isUpdating}
                    />
                    <Label
                      htmlFor={`${category.category}_${eventName}`}
                      className={cn(
                        "text-sm ",
                        logEvents[index] === "1" ? `text-foreground/80` : ``,
                      )}
                    >
                      {eventName}
                    </Label>
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

export default OneLogChannel;
