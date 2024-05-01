import { type UseQueryResult, useQuery } from "react-query";
import { apiInstance } from "@/config/bluetick";
import { type DiscordGuild } from "@/types/bluetick/discord";

/**
 * Fetches the list of guilds associated with a specific bot.
 * @param botID - The identifier of the bot.
 * @returns A Promise resolving to an array of DiscordGuild.
 */
const fetchBotGuilds = async (botID: string): Promise<DiscordGuild[]> => {
  const { data } = await apiInstance.get<{ data: DiscordGuild[] }>(
    `/discord/guilds/${botID}`,
  );
  return data.data;
};

/**
 * Custom hook to fetch guilds associated with a bot.
 * @param botID - The identifier of the bot.
 * @returns An object from useQuery hook containing guilds data, loading status, and any errors.
 */
export function useFetchBotGuilds(
  botID: string,
): UseQueryResult<DiscordGuild[], Error> {
  return useQuery<DiscordGuild[], Error>(
    ["guildChannels", botID],
    async () => await fetchBotGuilds(botID),
    {
      enabled: !!botID, // Only run the query if botID is truthy
    },
  );
}
