import { type UseQueryResult, useQuery } from "react-query";

import { twitchInstance } from "@/config/twitch-service";
import { type TwitchUser } from "@/types/twitch";

const fetchTwitchUsers = async (ids: string[]): Promise<TwitchUser[]> => {
  const response = await twitchInstance.post<{ users: TwitchUser[] }>(
    `/users`,
    {
      ids,
    },
  );
  console.log(response.data);
  return response.data.users;
};

export const useFetchTwitchUsers = (
  ids: string[],
): UseQueryResult<TwitchUser[], Error> => {
  return useQuery<TwitchUser[], Error>(
    ["twitchUsers", ...ids], // This makes the query key dependent on ids
    async () => await fetchTwitchUsers(ids),
    {
      // Add any options here
      enabled: ids.length > 0,
    },
  );
};
