import { type UseQueryResult, useQuery } from "react-query";

import { twitchInstance } from "@/config/twitch-service";
import { type TwitchUser } from "@/types/twitch";

const fetchTwitchStreamListeners = async (): Promise<TwitchUser[]> => {
  const response = await twitchInstance.get(`/streams`);
  return response.data;
};

export const useFetchTwitchStreamListeners = (): UseQueryResult<
  TwitchUser[],
  Error
> => {
  return useQuery<TwitchUser[], Error>(
    ["twitchStreamSubs"],
    async () => await fetchTwitchStreamListeners(),
    {
      // Add any options here
      enabled: true,
    },
  );
};
