import { useQuery } from 'react-query';
import { ROUTES, apiInstance } from '@/config/bluetick';

import { GuildLogIgnores } from '@/types/bluetick/db/bot-logs/logs-ignore';

const fetchGuildLogIgnores = async (
  botID: string,
  guildID: string
): Promise<GuildLogIgnores> => {
  const response = await apiInstance.get(
    `/${ROUTES.LOG_SETTING}/ignores/${botID}/${guildID}`
  );
  return response.data.data;
};

export const useFetchGuildLogIgnores = (botID: string, guildID: string) => {
  return useQuery<GuildLogIgnores, Error>(
    ['guildLogIgnores', botID, guildID],
    () => fetchGuildLogIgnores(botID, guildID),
    {
      // Add any options here
      enabled: !!botID && !!guildID, // This ensures the query only runs when botID and guildID are available
    }
  );
};
