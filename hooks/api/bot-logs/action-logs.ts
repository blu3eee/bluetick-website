import { type UseQueryResult, useQuery } from "react-query";
import { ROUTES, apiInstance } from "@/config/bluetick";

import { type BotGuildActionLogDetails } from "@/types/bluetick/db/bot-logs/action-logs";

const fetchGuildActionLogs = async (
  botID: string,
  guildID: string,
): Promise<BotGuildActionLogDetails[]> => {
  const response = await apiInstance.get(
    `/${ROUTES.ACTION_LOGS}/${botID}/${guildID}`,
  );
  return response.data.data;
};

export const useFetchGuildActionLogs = (
  botID: string,
  guildID: string,
): UseQueryResult<BotGuildActionLogDetails[], Error> => {
  return useQuery<BotGuildActionLogDetails[], Error>(
    ["guildActionLogs", botID, guildID],
    async () => await fetchGuildActionLogs(botID, guildID),
    {
      // Add any options here
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    },
  );
};
