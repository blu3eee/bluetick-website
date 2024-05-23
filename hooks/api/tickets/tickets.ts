import { type UseQueryResult, useQuery } from "react-query";
import { ROUTES, apiInstance } from "@/config/bluetick";
import type { TicketDetails } from "@/types/bluetick/db/tickets";

const fetchUserTickets = async (
  botID: string,
  requestedUserID: string,
): Promise<TicketDetails[]> => {
  const response = await apiInstance.get(
    `/${ROUTES.TICKETS}?botID=${botID}&userID=${requestedUserID}`,
  );
  return response.data.data;
};

export const useFetchUserTickets = (
  botID: string,
  requestedUserID: string,
): UseQueryResult<TicketDetails[], Error> => {
  return useQuery<TicketDetails[], Error>(
    ["tickets", botID, requestedUserID],
    async () => await fetchUserTickets(botID, requestedUserID),
    {
      enabled: !!botID && !!requestedUserID, // This ensures the query only runs when botID and guildID are available
    },
  );
};

const fetchGuildTickets = async (
  botID: string,
  guildID: string,
): Promise<TicketDetails[]> => {
  const response = await apiInstance.get(
    `/${ROUTES.TICKETS}?botID=${botID}&guildID=${guildID}`,
  );
  return response.data.data;
};

export const useFetchGuildTickets = (
  botID: string,
  guildID: string,
): UseQueryResult<TicketDetails[], Error> => {
  return useQuery<TicketDetails[], Error>(
    ["tickets", botID, guildID],
    async () => await fetchGuildTickets(botID, guildID),
    {
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    },
  );
};
