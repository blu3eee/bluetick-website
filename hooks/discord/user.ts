import { DiscordUser } from '@/types/bluetick/discord';
import { DISCORD_BASE_URL } from '@/hooks/discord';
import axios from 'axios';

export const useFetchDiscordUser = async (
  userToken: string
): Promise<DiscordUser | null> => {
  try {
    const response = await axios.get(`${DISCORD_BASE_URL}/users/@me`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user information:', error);
    return null;
  }
};
