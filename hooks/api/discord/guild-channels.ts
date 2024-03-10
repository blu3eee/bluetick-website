import { useQuery } from 'react-query';
import { apiInstance } from '@/config/bluetick';
import { DiscordPartialGuildChannel } from '@/types/bluetick/discord';

const fetchGuildChannels = async (botID: string, guildID: string) => {
  const { data } = await apiInstance.get<{
    data: DiscordPartialGuildChannel[];
  }>(`/discord/guilds/${botID}/${guildID}/channels/`);
  return data.data;
};

export function useFetchGuildChannels(botID: string, guildID: string) {
  const { data, isLoading, error } = useQuery(
    ['guildChannels', botID, guildID],
    () => fetchGuildChannels(botID, guildID),
    {
      enabled: !!botID && !!guildID, // Only run the query if botID and guildID are truthy
      select: (channels) => {
        return channels;
      },
    }
  );

  return { channels: data, isLoading, error };
}
