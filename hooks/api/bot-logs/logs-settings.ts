import { type UseQueryResult, useQuery } from "react-query";
import { ROUTES, apiInstance } from "@/config/bluetick";

import { type GuildLogSettingDetails } from "@/types/bluetick/db/bot-logs/logs-settings";

const fetchGuildLogSetting = async (
  botID: string,
  guildID: string,
): Promise<GuildLogSettingDetails> => {
  const response = await apiInstance.get(
    `/${ROUTES.LOG_SETTING}/${botID}/${guildID}`,
  );
  return response.data.data;
};

export const useFetchGuildLogSetting = (
  botID: string,
  guildID: string,
): UseQueryResult<GuildLogSettingDetails, Error> => {
  return useQuery<GuildLogSettingDetails, Error>(
    ["guildLogSettings", botID, guildID],
    async () => await fetchGuildLogSetting(botID, guildID),
    {
      // Add any options here
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    },
  );
};
