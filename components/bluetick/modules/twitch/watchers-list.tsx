import TwitchUserDisplay from "@/components/dev/twitch/user";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { secondaryStyle } from "@/config/site";
import { BluetickContext } from "@/context/bluetick-context";
import { useFetchTwitchUsers } from "@/hooks/twitch/users";
import { cn } from "@/lib/utils";
import type { TwitchUser } from "@/types/twitch";
import type { TwitchWatcherDetails } from "@/types/twitch/watcher";
import React, { useContext } from "react";
import DisplayNotificationMessage from "./display-noti";
import EditNotificationDialog from "./edit-dialog";
import type { MessageInfoDetails } from "@/types/bluetick";
import { generateTwitchPlaceholders } from ".";
import { toast } from "sonner";
import { ChannelSelect } from "@/components/bluetick/ui/channel-select";
import { GuildContext } from "@/context/guild-context";
import { apiInstance } from "@/config/bluetick";
import { Button } from "@/components/ui/button";

interface Props {
  watchers: TwitchWatcherDetails[] | undefined;
  refetch: () => void;
}

const WatchersList: React.FC<Props> = ({ watchers, refetch }) => {
  const { botDetails, isLoading } = useContext(BluetickContext);
  const { channels, isLoadingChannels } = useContext(GuildContext);

  // Extract twitchUserId from watchers and use it to fetch Twitch users
  const twitchUserIds = watchers?.map((watcher) => watcher.twitchUserId) ?? [];

  const {
    data: twitchUsers,
    isLoading: isLoadingTwitchUsers,
    status: twitchUsersStatus,
  } = useFetchTwitchUsers(twitchUserIds);

  const [watchUsers, setWatchUsers] = React.useState<
    Array<{ watcher: TwitchWatcherDetails; user: TwitchUser }>
  >([]);

  const [selectedWatcher, setSelectedWatcher] = React.useState<{
    watcher: TwitchWatcherDetails;
    user: TwitchUser;
  } | null>(null);

  React.useEffect(() => {
    if (watchers && twitchUsers) {
      const combined = watchers
        .map((watcher) => ({
          watcher,
          user: twitchUsers.find((user) => user.id === watcher.twitchUserId),
        }))
        .filter((item) => item.user !== undefined)
        .map(
          (item) => item as { watcher: TwitchWatcherDetails; user: TwitchUser },
        );

      setWatchUsers(combined);
    }

    if (watchers && watchers.length === 0) {
      setWatchUsers([]);
    }
  }, [watchers, twitchUsers, twitchUsersStatus]);

  const handleUpdateMessage = async (
    id: number,
    message: MessageInfoDetails,
  ): Promise<void> => {
    try {
      const response = await apiInstance.patch<{
        data: { watcher: TwitchWatcherDetails; message: string };
      }>(`/twitch/watchers/${id}`, {
        message,
      });
      console.log(response.status);
      if (response.status === 200) {
        toast.success(`Twitch live notification message updated`);
        refetch();
      } else {
        toast.error(`Failed to update live notification message`);
      }
    } catch (e) {
      toast.error(
        `An error happened while trying to update live notification message`,
      );
    }
  };

  const handleUpdateChannel = async (
    id: number,
    channelId: string,
  ): Promise<void> => {
    try {
      const response = await apiInstance.patch<{
        data: { watcher: TwitchWatcherDetails; message: string };
      }>(`/twitch/watchers/${id}`, {
        postChannelId: channelId,
      });
      console.log(response.status);
      if (response.status === 200) {
        toast.success(`Twitch live notification channel updated`);
        refetch();
      } else {
        toast.error(`Failed to update live notification channel`);
      }
    } catch (e) {
      toast.error(
        `An error happened while trying to update notification channel`,
      );
    }
  };

  const handleUnwatch = async (id: number): Promise<void> => {
    try {
      const response = await apiInstance.delete(`/twitch/watchers/${id}`);
      console.log(response.status);
      if (response.status === 200) {
        toast.success(`Unwatched user`);
        refetch();
        setSelectedWatcher(null);
      } else {
        toast.error(`Failed to unwatch user`);
      }
    } catch (e) {
      toast.error(
        `An error happened while trying to update notification channel`,
      );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={cn(secondaryStyle)}>
        <Label className="uppercase text-twitch text-sm">
          LIST OF WATCHERS
        </Label>

        {watchers === undefined ||
        isLoadingTwitchUsers ||
        twitchUsers === null ? (
          <Skeleton className="w-full h-10" />
        ) : watchUsers.length === 0 ? (
          <div className="text-sm font-medium text-info">
            Empty list, add notification below...
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {watchUsers.map((watchUser, index) => (
              <Badge
                key={index}
                variant={
                  selectedWatcher?.user.id === watchUser.user.id
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer border-twitch"
                onClick={() => {
                  setSelectedWatcher(watchUser);
                }}
              >
                {watchUser.user?.displayName ?? watchUser.watcher.twitchUserId}
              </Badge>
            ))}
          </div>
        )}
      </div>
      {selectedWatcher && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="flex flex-col gap-2">
            <div className={cn(secondaryStyle, "flex flex-col gap-2 h-fit")}>
              <div className="flex flex-wrap justify-between gap-2 items-center">
                <Label className="text-twitch uppercase font-semibold">
                  Twitch Watcher
                </Label>
                <Button
                  size={"sm"}
                  variant={"error"}
                  onClick={() => {
                    handleUnwatch(selectedWatcher.watcher.id).catch((e) => {});
                  }}
                >
                  Unwatch
                </Button>
              </div>
              <TwitchUserDisplay
                {...selectedWatcher.user}
                showBgImage={false}
              />
            </div>
            <div className={cn(secondaryStyle, "flex flex-col gap-2 h-fit")}>
              <Label className="text-twitch uppercase font-semibold">
                Live Notification Channel
              </Label>
              {!channels || isLoadingChannels ? (
                <Skeleton className="w-full h-10" />
              ) : (
                <ChannelSelect
                  initChannelId={selectedWatcher.watcher.postChannelId}
                  options={channels.textChannels}
                  onSelect={(id) => {
                    handleUpdateChannel(selectedWatcher.watcher.id, id).catch(
                      (e) => {},
                    );
                  }}
                />
              )}
            </div>
          </div>
          <div className={cn(secondaryStyle, "flex flex-col gap-2 col-span-2")}>
            <Label className="text-twitch uppercase font-semibold">
              Live Notification Message
            </Label>
            <div>
              <EditNotificationDialog
                message={selectedWatcher.watcher.message}
                onSubmit={(msg: MessageInfoDetails) => {
                  handleUpdateMessage(selectedWatcher.watcher.id, msg).catch(
                    (e) => {},
                  );
                }}
                placeholders={generateTwitchPlaceholders(selectedWatcher.user)}
              />
            </div>
            {isLoading || !botDetails ? (
              <Skeleton className="w-full h-24" />
            ) : (
              <DisplayNotificationMessage
                botDetails={botDetails}
                message={selectedWatcher.watcher.message}
                streamerDetails={generateTwitchPlaceholders(
                  selectedWatcher.user,
                )}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchersList;
