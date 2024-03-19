import { useQuery } from 'react-query';
import { ROUTES, apiInstance } from '@/config/bluetick';
import type { TicketDetails } from '@/types/bluetick/db/tickets';

const fetchUserTickets = async (
  botID: string,
  guildID: string,
  requestedUserID: string
): Promise<TicketDetails[]> => {
  const response = await apiInstance.get(
    `/${ROUTES.TICKETS}/${botID}/${guildID}/${requestedUserID}`
  );
  return response.data.data;
};

export const useFetchUserTickets = (
  botID: string,
  guildID: string,
  requestedUserID: string
) => {
  return useQuery<TicketDetails[], Error>(
    ['tickets', botID, guildID, requestedUserID],
    () => fetchUserTickets(botID, guildID, requestedUserID),
    {
      enabled: !!botID && !!guildID && !!requestedUserID, // This ensures the query only runs when botID and guildID are available
    }
  );
};

const fetchGuildTickets = async (
  botID: string,
  guildID: string
): Promise<TicketDetails[]> => {
  const response = await apiInstance.get(
    `/${ROUTES.TICKETS}/${botID}/${guildID}`
  );
  return response.data.data;
};

export const useFetchGuildTickets = (botID: string, guildID: string) => {
  return useQuery<TicketDetails[], Error>(
    ['tickets', botID, guildID],
    () => fetchGuildTickets(botID, guildID),
    {
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    }
  );
};
