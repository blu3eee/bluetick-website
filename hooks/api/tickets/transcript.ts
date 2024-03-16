import { useQuery } from 'react-query';
import { ROUTES, apiInstance } from '@/config/bluetick';
import type { TicketTranscriptDetails } from '@/types/bluetick/db/tickets';

const fetchTicketTranscript = async (
  ticketID: number,
  requestedUserID: string
): Promise<TicketTranscriptDetails> => {
  const response = await apiInstance.post(
    `/${ROUTES.TICKETS}/${ticketID}/transcript`,
    {
      requestedUserID,
    }
  );
  return response.data.data;
};

export const useFetchTicketTranscript = (
  ticketID: number,
  requestedUserID: string,
  options = {} // Add an options parameter to pass custom configurations like 'enabled'
) => {
  return useQuery<TicketTranscriptDetails, Error>(
    ['ticketTranscript', ticketID, requestedUserID],
    () => fetchTicketTranscript(ticketID, requestedUserID),
    {
      ...options, // Spread the options to use 'enabled' and any other React Query options
    }
  );
};
