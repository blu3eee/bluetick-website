// useServerInfo.ts
import { type UseQueryResult, useQuery } from "react-query";
import { type DiscordGuild } from "@/types/bluetick/discord";
import { type BotGuildConfig } from "@/types/bluetick/db/guild-config";
import { apiInstance } from "@/config/bluetick";

export const fetchGuildData = async (
  botId: string,
  serverId: string,
): Promise<{
  guildInfo: DiscordGuild;
  guildConfig: BotGuildConfig;
}> => {
  const guildInfoPromise = apiInstance.get<{ data: DiscordGuild }>(
    `/discord/guilds/${botId}/${serverId}`,
  );
  const guildConfigPromise = apiInstance.get<{ data: BotGuildConfig }>(
    `/guilds-config/${botId}/${serverId}`,
  );

  const [guildInfoResponse, guildConfigResponse] = await Promise.all([
    guildInfoPromise,
    guildConfigPromise,
  ]);

  const guildInfo = guildInfoResponse.data.data;
  const guildConfig = guildConfigResponse.data.data;

  return { guildInfo, guildConfig };
};

export const useGuildData = (
  botId: string,
  serverId: string,
): UseQueryResult<
  {
    guildInfo: DiscordGuild;
    guildConfig: BotGuildConfig;
  },
  unknown
> => {
  return useQuery(
    ["guildData", serverId],
    async () => await fetchGuildData(botId, serverId),
    {
      enabled: !!serverId && !!botId, // Only run the query if serverId and botId are truthy
    },
  );
};
