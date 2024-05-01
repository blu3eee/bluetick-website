import { type UseQueryResult, useQuery } from "react-query";
import { ROUTES, apiInstance } from "@/config/bluetick";

import { type AutoResponseDetails } from "@/types/bluetick/db/autores";

const fetchGuildAutores = async (
  botID: string,
  guildID: string,
): Promise<AutoResponseDetails[]> => {
  const response = await apiInstance.get(
    `/${ROUTES.AUTO_RESPONSE}/${botID}/${guildID}`,
  );
  return response.data.data;
};

export const useFetchGuildAutoRes = (
  botID: string,
  guildID: string,
): UseQueryResult<AutoResponseDetails[], Error> => {
  return useQuery<AutoResponseDetails[], Error>(
    ["guildAutoRes", botID, guildID],
    async () => await fetchGuildAutores(botID, guildID),
    {
      // Add any options here
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    },
  );
};
