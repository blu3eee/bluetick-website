"use client";
import { apiInstance } from "@/config/bluetick";
import { useGuildData } from "@/hooks/api/discord/guild";
import { useFetchGuildChannels } from "@/hooks/api/discord/guild-channels";
import useMutualGuilds from "@/hooks/api/discord/mutual-guilds";
import {
  type BotGuildConfig,
  type UpdateGuildConfig,
} from "@/types/bluetick/db/guild-config";
import {
  type DiscordGuild,
  type DiscordPartialGuildChannel,
} from "@/types/bluetick/discord";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface GuildContextValue {
  discordGuild: DiscordGuild | null;
  config: BotGuildConfig | null;
  isLoading: boolean;
  channels: {
    textChannels: DiscordPartialGuildChannel[];
    voiceChannels: DiscordPartialGuildChannel[];
    categories: DiscordPartialGuildChannel[];
  } | null;
  isLoadingChannels: boolean;
  refetchGuildData: () => void;
  updateConfig: (updateDto: UpdateGuildConfig) => Promise<boolean>;
}

export const GuildContext = createContext<GuildContextValue>({
  discordGuild: null,
  config: null,
  isLoading: false,
  channels: null,
  isLoadingChannels: false,
  refetchGuildData: () => {},
  updateConfig: async () => {
    return false;
  },
});

export const GuildContextProvider = ({
  children,
  serverId,
  botId,
}: {
  children: React.ReactNode;
  serverId: string;
  botId: string;
}): React.ReactElement => {
  const {
    data: guildData,
    isLoading,
    refetch: refetchData,
  } = useGuildData(botId, serverId);

  const { channels: guildChannels, isLoading: isLoadingGuildChannels } =
    useFetchGuildChannels(botId, serverId);

  const { mutualGuilds, loadingState: isLoadingMutualGuilds } =
    useMutualGuilds();

  const router = useRouter();
  const { data: session, status } = useSession();
  React.useEffect(
    () => {
      if (status === "loading" || session?.developerMode) {
        return;
      }

      if (isLoadingMutualGuilds === "completed") {
        if (
          mutualGuilds &&
          mutualGuilds.filter((server) => server.id === serverId).length === 0
        ) {
          router.push("/servers");
          toast.error("Invalid server request");
        } else if (!mutualGuilds) {
          router.push("/servers");
          toast.error("Invalid to load your available servers");
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoadingMutualGuilds, status, session],
  );

  const [discordGuildState, setDiscordGuildState] =
    useState<DiscordGuild | null>(null);

  const [configState, setConfigState] = useState<BotGuildConfig | null>(null);

  const [guildChannelsState, setGuildChannelsState] = useState<{
    textChannels: DiscordPartialGuildChannel[];
    voiceChannels: DiscordPartialGuildChannel[];
    categories: DiscordPartialGuildChannel[];
  } | null>(null);

  React.useEffect(() => {
    if (guildData) {
      setDiscordGuildState(guildData.guildInfo);
      setConfigState(guildData.guildConfig);
    }
  }, [guildData]);

  React.useEffect(() => {
    if (guildChannels) {
      const textChannels = guildChannels.filter(
        (channel) => channel.type === 0,
      );
      const voiceChannels = guildChannels.filter(
        (channel) => channel.type === 2,
      );
      const categories = guildChannels.filter((channel) => channel.type === 4);
      setGuildChannelsState({
        textChannels,
        voiceChannels,
        categories,
      });
    }
  }, [guildChannels]);
  const updateConfig = async (
    updateDto: UpdateGuildConfig,
  ): Promise<boolean> => {
    const { data } = await apiInstance.patch<{ data: BotGuildConfig }>(
      `/guilds-config/${botId}/${serverId}`,
      updateDto,
    );

    if (data.data) {
      setConfigState(data.data);
      await refetchData();
      return true;
    } else {
      return false;
    }
  };

  const contextValue: GuildContextValue = {
    discordGuild: discordGuildState,
    config: configState,
    isLoading,
    channels: guildChannelsState,
    isLoadingChannels: isLoadingGuildChannels,
    refetchGuildData: () => {
      refetchData().catch((e) => {});
    },
    updateConfig,
  };

  return (
    <GuildContext.Provider value={contextValue}>
      {children}
    </GuildContext.Provider>
  );
};

export const useCurrentGuildContext = (): GuildContextValue => {
  const context = useContext(GuildContext);
  if (context === undefined) {
    throw new Error(
      "useMutualGuildsContext must be used within a MutualGuildsProvider",
    );
  }
  return context;
};
