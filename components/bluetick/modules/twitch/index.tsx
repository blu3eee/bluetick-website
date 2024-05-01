"use client";
import { Label } from "@/components/ui/label";
import { secondaryStyle } from "@/config/site";
import { cn } from "@/lib/utils";
import React, { useContext } from "react";
import SearchAndAdd from "./search-add";
import type { PlaceholderProps } from "../../ui/placeholder";
import { useFetchTwitchWatchers } from "@/hooks/twitch/watchers";
import { BLUETICK_BOT_ID } from "@/config/bluetick";
import { GuildContext } from "@/context/guild-context";
import WatchersList from "./watchers-list";
import type { TwitchUser } from "@/types/twitch";
import { images } from "@/config/images";

const TwitchComponent = (): JSX.Element => {
  const { discordGuild } = useContext(GuildContext);
  const { data: watchers, refetch: refetchWatchers } = useFetchTwitchWatchers(
    discordGuild !== null,
    BLUETICK_BOT_ID,
    discordGuild?.id,
  );

  return (
    <div className="flex flex-col gap-2">
      {/* <Callout type="warning">This feature is still experimental</Callout> */}
      <WatchersList
        watchers={watchers}
        refetch={() => {
          refetchWatchers().catch((e) => {
            console.error(`Error refetching watchers`);
            console.error(e);
          });
        }}
      />
      <div className={cn(secondaryStyle)}>
        <Label className="uppercase text-twitch font-semibold">
          Search Twitch User With Username or Id
        </Label>
        <SearchAndAdd
          refetch={() => {
            refetchWatchers().catch((e) => {});
          }}
        />
      </div>
    </div>
  );
};

export default TwitchComponent;

export const generateTwitchPlaceholders = (
  streamer: TwitchUser,
): Record<string, string> => {
  return {
    streamTitle: "Play with me!!",
    streamLink: `https://twitch.tv/${streamer.name}`,
    streamer: streamer.displayName,
    streamerAvatar: streamer.profilePictureUrl ?? "/discord/discord.png",
    streamPreview: streamer.offlinePlaceholderUrl ?? images.twitchLive,
  };
};

export const twitchPlaceholders: PlaceholderProps[] = [
  {
    name: "{streamTitle}",
    description: "The title of the stream",
  },
  {
    name: "{streamLink}",
    description: "The URL to the stream",
  },
  {
    name: "{game}",
    description: "The name of the game the streamer is currently playing",
  },
  {
    name: "{streamer}",
    description: "The display name of the streamer",
  },
  {
    name: "{streamerAvatar}",
    description: "The avatar of the streamer",
  },
  {
    name: "{streamPreview}",
    description: "A preview image of the stream",
  },
  {
    name: "{everyone}",
    description: "@everyone",
  },
  {
    name: "{here}",
    description: "@here",
  },
];
