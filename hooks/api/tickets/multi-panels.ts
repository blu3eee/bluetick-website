import { useQuery } from 'react-query';
import { ROUTES, apiInstance } from '@/config/bluetick';
import { TicketMultiPanelDetails } from '@/types/bluetick/db/tickets';

const fetchTicketMultiPanels = async (
  botID: string,
  guildID: string
): Promise<TicketMultiPanelDetails[]> => {
  const response = await apiInstance.get(
    `/${ROUTES.TICKET_MULTI_PANELS}/${botID}/${guildID}`
  );
  return response.data.data;
};

export const useFetchTicketMultiPanels = (botID: string, guildID: string) => {
  return useQuery<TicketMultiPanelDetails[], Error>(
    ['guildTicketMultiPanels', botID, guildID],
    () => fetchTicketMultiPanels(botID, guildID),
    {
      // Add any options here
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    }
  );
};
