import { useQuery } from 'react-query';
import { ROUTES, apiInstance } from '@/config/bluetick';
import { TicketSupportTeamDetails } from '@/types/bluetick/db/tickets';

const fetchGuildTicketSupportTeams = async (
  botID: string,
  guildID: string
): Promise<TicketSupportTeamDetails[]> => {
  const response = await apiInstance.get(
    `/${ROUTES.TICKET_SUPPORT_TEAMS}/${botID}/${guildID}`
  );
  return response.data.data;
};

export const useFetchGuildTicketSupportTeams = (
  botID: string,
  guildID: string
) => {
  return useQuery<TicketSupportTeamDetails[], Error>(
    ['guildTicketSupportTeam', botID, guildID],
    () => fetchGuildTicketSupportTeams(botID, guildID),
    {
      // Add any options here
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    }
  );
};
