import { useQuery } from 'react-query';
import { ROUTES, apiInstance } from '@/config/bluetick';

import { AutoRoleDetails } from '@/types/bluetick/db/autorole';

const fetchGuildAutoRoles = async (
  botID: string,
  guildID: string
): Promise<AutoRoleDetails[]> => {
  const response = await apiInstance.get(
    `/${ROUTES.AUTO_ROLES}/${botID}/${guildID}`
  );
  return response.data.data;
};

export const useFetchGuildAutoRoles = (botID: string, guildID: string) => {
  return useQuery<AutoRoleDetails[], Error>(
    ['guildAutoRole', botID, guildID],
    () => fetchGuildAutoRoles(botID, guildID),
    {
      // Add any options here
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    }
  );
};
