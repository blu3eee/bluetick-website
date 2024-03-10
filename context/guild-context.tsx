'use client';
import { apiInstance } from '@/config/bluetick';
import { useGuildData } from '@/hooks/api/discord/guild';
import { useFetchGuildChannels } from '@/hooks/api/discord/guild-channels';
import {
  BotGuildConfig,
  UpdateGuildConfig,
} from '@/types/bluetick/db/guild-config';
import {
  DiscordGuild,
  DiscordPartialGuildChannel,
} from '@/types/bluetick/discord';
import React, { createContext, useState } from 'react';

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
}) => {
  const {
    guildData,
    isLoading,
    refetchGuildData: refetchData,
  } = useGuildData(serverId, botId);

  const { channels: guildChannels, isLoading: isLoadingGuildChannels } =
    useFetchGuildChannels(botId, serverId);

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
        (channel) => channel.type === 0
      );
      const voiceChannels = guildChannels.filter(
        (channel) => channel.type === 2
      );
      const categories = guildChannels.filter((channel) => channel.type === 4);
      setGuildChannelsState({
        textChannels,
        voiceChannels,
        categories,
      });
    }
  }, [guildChannels]);
  const updateConfig = async (updateDto: UpdateGuildConfig) => {
    let { data } = await apiInstance.patch<{ data: BotGuildConfig }>(
      `/guilds-config/${botId}/${serverId}`,
      updateDto
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
    refetchGuildData: refetchData,
    updateConfig,
  };

  return (
    <GuildContext.Provider value={contextValue}>
      {children}
    </GuildContext.Provider>
  );
};
