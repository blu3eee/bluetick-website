import { useQuery } from 'react-query';
import { ROUTES, apiInstance } from '@/config/bluetick';
import { TicketPanelDetails } from '@/types/bluetick/db/tickets';

const fetchReactionPanels = async (
  botID: string,
  guildID: string
): Promise<TicketPanelDetails[]> => {
  const response = await apiInstance.get(
    `/${ROUTES.TICKET_PANELS}/${botID}/${guildID}`
  );
  return response.data.data;
};

export const useFetchTicketPanels = (botID: string, guildID: string) => {
  return useQuery<TicketPanelDetails[], Error>(
    ['guildTicketPanels', botID, guildID],
    () => fetchReactionPanels(botID, guildID),
    {
      // Add any options here
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    }
  );
};
