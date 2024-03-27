import { useQuery } from 'react-query';
import { apiInstance } from '@/config/bluetick';
import { TwitchWatcherDetails } from '@/types/twitch/watcher';

const fetchTwitchWatchers = async ({
  botID,
  guildID,
  twitchUserId,
  postChannelId,
}: {
  botID?: string;
  guildID?: string;
  twitchUserId?: string;
  postChannelId?: string;
}): Promise<TwitchWatcherDetails[]> => {
  // Filter out undefined properties
  const params: Record<string, string> = {};
  if (botID) params.botID = botID;
  if (guildID) params.guildID = guildID;
  if (twitchUserId) params.twitchUserId = twitchUserId;
  if (postChannelId) params.postChannelId = postChannelId;

  const queryParams = new URLSearchParams(params).toString();
  const response = await apiInstance.get<{ data: TwitchWatcherDetails[] }>(
    `/twitch/watchers?${queryParams}`
  );
  return response.data.data;
};

export const useFetchTwitchWatchers = (
  enabled: boolean,
  botID: string,
  guildID?: string,
  twitchUserId?: string,
  postChannelId?: string
) => {
  return useQuery<TwitchWatcherDetails[], Error>(
    ['twitchWatchers', botID, guildID, twitchUserId, postChannelId],
    () => fetchTwitchWatchers({ botID, guildID, twitchUserId, postChannelId }),
    {
      // The query is enabled only if botID is provided
      enabled: !!botID && enabled,
    }
  );
};
