"use client";
// MutualGuildsContext.tsx
import React, { createContext, useContext, type ReactNode } from "react";

import { type DiscordGuild } from "@/types/bluetick/discord";
import useMutualGuilds from "@/hooks/api/discord/mutual-guilds";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface MutualGuildsContextProps {
  mutualGuilds: DiscordGuild[];
  loadingState: "init" | "loading" | "completed";
  error: string | null;
}

const MutualGuildsContext = createContext<MutualGuildsContextProps | undefined>(
  undefined,
);

export const MutualGuildsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { mutualGuilds, loadingState, error } = useMutualGuilds();
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(
    () => {
      if (status !== "loading" && !session) {
        router.push("/");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [status, session],
  );

  return (
    <MutualGuildsContext.Provider value={{ mutualGuilds, loadingState, error }}>
      {children}
    </MutualGuildsContext.Provider>
  );
};

export const useMutualGuildsContext = (): MutualGuildsContextProps => {
  const context = useContext(MutualGuildsContext);
  if (context === undefined) {
    throw new Error(
      "useMutualGuildsContext must be used within a MutualGuildsProvider",
    );
  }
  return context;
};
