import { useQuery } from 'react-query';
import { ROUTES, apiInstance } from '@/config/bluetick';
import { DiscordGuildMember } from '@/types/bluetick/discord';

const fetchGuildMembers = async (botID: string, guildID: string) => {
  const { data } = await apiInstance.get<{
    data: DiscordGuildMember[];
  }>(`${ROUTES.DISCORD}/guilds/${botID}/${guildID}/members`);
  return data.data;
};

export function useFetchGuildMembers(botID: string, guildID: string) {
  return useQuery<DiscordGuildMember[], Error>(
    ['guildMembers', guildID],
    () => fetchGuildMembers(botID, guildID),
    {
      enabled: !!botID && !!guildID, // Only run the query if botID and guildID are truthy
    }
  );
}
