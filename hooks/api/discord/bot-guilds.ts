import { useQuery } from 'react-query';
import { apiInstance } from '@/config/bluetick';
import { DiscordGuild } from '@/types/bluetick/discord';

const fetchBotGuilds = async (botID: string) => {
  const { data } = await apiInstance.get<{
    data: DiscordGuild[];
  }>(`/discord/guilds/${botID}`);
  return data.data;
};

export function useFetchBotGuilds(botID: string) {
  return useQuery(['guildChannels', botID], () => fetchBotGuilds(botID), {
    enabled: !!botID,
  });
}
