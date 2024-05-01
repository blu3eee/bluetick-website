import { type UseQueryResult, useQuery } from "react-query";
import { apiInstance } from "@/config/bluetick";
import { type DiscordPartialGuildChannel } from "@/types/bluetick/discord";

/**
 * Fetches the guild channels for a specific bot and guild.
 * @param botID - The ID of the bot.
 * @param guildID - The ID of the guild.
 * @returns A Promise resolving to an array of DiscordPartialGuildChannel.
 */
const fetchGuildChannels = async (
  botID: string,
  guildID: string,
): Promise<DiscordPartialGuildChannel[]> => {
  const { data } = await apiInstance.get<{
    data: DiscordPartialGuildChannel[];
  }>(`/discord/guilds/${botID}/${guildID}/channels/`);
  return data.data;
};

/**
 * Custom hook for fetching Discord guild channels.
 * @param botID - The ID of the bot.
 * @param guildID - The ID of the guild.
 * @returns An object containing the channel data, loading status, and any errors.
 */
export function useFetchGuildChannels(
  botID: string,
  guildID: string,
): {
  channels: DiscordPartialGuildChannel[] | undefined;
  isLoading: boolean;
  error: unknown;
} {
  const { data, isLoading, error } = useQuery(
    ["guildChannels", botID, guildID],
    async () => await fetchGuildChannels(botID, guildID),
    {
      enabled: !!botID && !!guildID, // Only run the query if botID and guildID are truthy
      select: (channels) => {
        return channels;
      },
    },
  );

  return { channels: data, isLoading, error };
}

/**
 * Custom hook similar to useFetchGuildChannels but kept for naming consistency or specific usage.
 * @param botID - The ID of the bot.
 * @param guildID - The ID of the guild.
 * @returns An object containing the channel data, loading status, and any errors.
 */
export const useQueryGuildChannels = (
  botID: string,
  guildID: string,
): UseQueryResult<DiscordPartialGuildChannel[], unknown> => {
  return useQuery(
    ["guildChannels", botID, guildID],
    async () => await fetchGuildChannels(botID, guildID),
    {
      enabled: !!botID && !!guildID, // Only run the query if botID and guildID are truthy
      select: (channels) => {
        return channels;
      },
    },
  );
};
