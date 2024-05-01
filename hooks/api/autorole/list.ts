import { type UseQueryResult, useQuery } from "react-query";
import { ROUTES, apiInstance } from "@/config/bluetick";

import { type AutoRoleDetails } from "@/types/bluetick/db/autorole";

const fetchGuildAutoRoles = async (
  botID: string,
  guildID: string,
): Promise<AutoRoleDetails[]> => {
  const response = await apiInstance.get(
    `/${ROUTES.AUTO_ROLES}/${botID}/${guildID}`,
  );
  return response.data.data;
};

export const useFetchGuildAutoRoles = (
  botID: string,
  guildID: string,
): UseQueryResult<AutoRoleDetails[], Error> => {
  return useQuery<AutoRoleDetails[], Error>(
    ["guildAutoRole", botID, guildID],
    async () => await fetchGuildAutoRoles(botID, guildID),
    {
      // Add any options here
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    },
  );
};
