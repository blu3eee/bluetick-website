import { type UseQueryResult, useQuery } from "react-query";
import { ROUTES, apiInstance } from "@/config/bluetick";
import { type TicketSettingDetails } from "@/types/bluetick/db/tickets";

const fetchGuildTicketSetting = async (
  botID: string,
  guildID: string,
): Promise<TicketSettingDetails> => {
  const response = await apiInstance.get(
    `/${ROUTES.TICKET_SETTINGS}/${botID}/${guildID}`,
  );
  return response.data.data;
};

export const useFetchGuildTicketSetting = (
  botID: string,
  guildID: string,
): UseQueryResult<TicketSettingDetails, Error> => {
  return useQuery<TicketSettingDetails, Error>(
    ["guildTicketSetting", botID, guildID],
    async () => await fetchGuildTicketSetting(botID, guildID),
    {
      // Add any options here
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    },
  );
};
