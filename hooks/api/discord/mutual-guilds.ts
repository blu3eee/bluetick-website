import { useEffect, useState } from "react";
import { BLUETICK_BOT_ID, apiInstance } from "@/config/bluetick";
import { type DiscordGuild } from "@/types/bluetick/discord";
import { useSession } from "next-auth/react";

const useMutualGuilds = (): {
  mutualGuilds: DiscordGuild[];
  loadingState: "init" | "loading" | "completed";
  error: string | null;
} => {
  const { data: session } = useSession();
  const [mutualGuilds, setMutualGuilds] = useState<DiscordGuild[]>([]);
  const [loadingState, setLoadingState] = useState<
    "init" | "loading" | "completed"
  >("init");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMutualGuilds = async (): Promise<void> => {
      if (!session || !session.user) return;

      setLoadingState("init");
      setError(null);

      try {
        const { data } = await apiInstance.get<{ data: DiscordGuild[] }>(
          `/discord/mutual-guilds/${BLUETICK_BOT_ID}/${session.user.id}`,
        );
        setMutualGuilds(data.data);
      } catch (err) {
        console.error("Error fetching mutual guilds:", err);
        setError("Failed to fetch mutual guilds");
      } finally {
        setLoadingState("completed");
      }
    };

    fetchMutualGuilds().catch((e) => {});
  }, [session]);

  return { mutualGuilds, loadingState, error };
};

export default useMutualGuilds;
