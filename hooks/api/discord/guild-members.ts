import { type UseQueryResult, useQuery } from "react-query";
import { ROUTES, apiInstance } from "@/config/bluetick";
import { type DiscordGuildMember } from "@/types/bluetick/discord";

/**
 * Fetches the guild members for a specific bot and guild.
 * @param botID - The ID of the bot.
 * @param guildID - The ID of the guild.
 * @returns A Promise resolving to an array of DiscordGuildMember.
 */
const fetchGuildMembers = async (
  botID: string,
  guildID: string,
): Promise<DiscordGuildMember[]> => {
  const { data } = await apiInstance.get<{
    data: DiscordGuildMember[];
  }>(`${ROUTES.DISCORD}/guilds/${botID}/${guildID}/members`);
  return data.data;
};

/**
 * Custom hook for fetching Discord guild members.
 * @param botID - The ID of the bot.
 * @param guildID - The ID of the guild.
 * @returns An object from useQuery hook containing guild members, loading status, and any errors.
 */
export function useFetchGuildMembers(
  botID: string,
  guildID: string,
): UseQueryResult<DiscordGuildMember[], Error> {
  return useQuery<DiscordGuildMember[], Error>(
    ["guildMembers", guildID],
    async () => await fetchGuildMembers(botID, guildID),
    {
      enabled: !!botID && !!guildID, // Only run the query if botID and guildID are truthy
    },
  );
}
