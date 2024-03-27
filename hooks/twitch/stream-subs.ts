import { useQuery } from 'react-query';

import { twitchInstance } from '@/config/twitch-service';
import { TwitchUser } from '@/types/twitch';

const fetchTwitchStreamListeners = async (): Promise<TwitchUser[]> => {
  const response = await twitchInstance.get(`/streams`);
  return response.data;
};

export const useFetchTwitchStreamListeners = () => {
  return useQuery<TwitchUser[], Error>(
    ['twitchStreamSubs'],
    () => fetchTwitchStreamListeners(),
    {
      // Add any options here
      enabled: true,
    }
  );
};
