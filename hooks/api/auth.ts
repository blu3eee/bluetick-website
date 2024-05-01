import { API_CONFIG, API_URL } from "@/config/bluetick";
import { type UserDetails } from "@/types/bluetick/db/user";
import axios from "axios";

export const useAuthStatus = async (): Promise<UserDetails | null> => {
  try {
    const { data } = await axios.get<{ data: UserDetails }>(
      `${API_URL}/auth/status/`,
      API_CONFIG,
    );
    return data.data;
  } catch (error) {
    console.error("Error fetching auth status:", error);
    return null;
  }
};
