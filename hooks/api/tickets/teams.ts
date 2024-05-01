import { type UseQueryResult, useQuery } from "react-query";
import { ROUTES, apiInstance } from "@/config/bluetick";
import { type TicketSupportTeamDetails } from "@/types/bluetick/db/tickets";

const fetchGuildTicketSupportTeams = async (
  botID: string,
  guildID: string,
): Promise<TicketSupportTeamDetails[]> => {
  const response = await apiInstance.get(
    `/${ROUTES.TICKET_SUPPORT_TEAMS}/${botID}/${guildID}`,
  );
  return response.data.data;
};

export const useFetchGuildTicketSupportTeams = (
  botID: string,
  guildID: string,
): UseQueryResult<TicketSupportTeamDetails[], Error> => {
  return useQuery<TicketSupportTeamDetails[], Error>(
    ["guildTicketSupportTeam", botID, guildID],
    async () => await fetchGuildTicketSupportTeams(botID, guildID),
    {
      // Add any options here
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    },
  );
};
