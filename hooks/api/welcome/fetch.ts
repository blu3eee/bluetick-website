import { type UseQueryResult, useQuery } from "react-query";
import { ROUTES, apiInstance } from "@/config/bluetick";
import { type BotGuildWelcomeDetails } from "@/types/bluetick/db/welcome";

const fetchGuildWelcome = async (
  botID: string,
  guildID: string,
): Promise<BotGuildWelcomeDetails> => {
  const response = await apiInstance.get(
    `/${ROUTES.BOTGUILDWELCOMES}/${botID}/${guildID}`,
  );
  return response.data.data;
};

export const useFetchGuildWelcome = (
  botID: string,
  guildID: string,
): UseQueryResult<BotGuildWelcomeDetails, Error> => {
  return useQuery<BotGuildWelcomeDetails, Error>(
    ["guildWelcome", botID, guildID],
    async () => await fetchGuildWelcome(botID, guildID),
    {
      // Add any options here
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    },
  );
};
