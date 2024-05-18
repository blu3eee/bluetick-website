"use client";
import React, { useState } from "react";
import { getGuildIconURL } from "@/lib/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Callout } from "@/components/callout";

import { buttonVariants } from "@/components/ui/button";
import ImageWithFallback from "@/components/custom-ui/image-with-fallback";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutualGuildsContext } from "@/app/(logged-in)/_context/mutual-guilds";
import type { DiscordGuild } from "@/types/bluetick/discord";
import { useSession } from "next-auth/react";
import { UserRound } from "lucide-react";

export const MutualServers = (): React.ReactNode => {
  const { mutualGuilds, loadingState, error } = useMutualGuildsContext();

  if (loadingState !== "completed") {
    return (
      <div className="flex flex-wrap w-full h-full gap-4 p-8 items-center justify-center">
        <Skeleton className="rounded-lg w-60 h-60" />
        <Skeleton className="rounded-lg w-60 h-60" />
        <Skeleton className="rounded-lg w-60 h-60" />
        <Skeleton className="rounded-lg w-60 h-60" />
        <Skeleton className="rounded-lg w-60 h-60" />
      </div>
    );
  }

  if (error) {
    return <Callout>Error: {error}</Callout>;
  }

  if (!Array.isArray(mutualGuilds) || mutualGuilds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <span>No servers found.</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-3 place-items-center justify-evenly">
      {mutualGuilds.map((guild) => {
        return <GuildCard key={guild.id} guild={guild} />;
      })}
    </div>
  );
};

interface GuildCardProps {
  guild: DiscordGuild;
}
const GuildCard: React.FC<GuildCardProps> = ({ guild }) => {
  const handleServerClick = (serverId: string): void => {
    router.push(`/dashboard/${serverId}`);
  };

  const router = useRouter();

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const { data: session } = useSession();
  return (
    <div
      className="border w-full bg-secondary rounded-md p-3 md:p-4 transition-all duration-300 ease-in-out flex flex-col gap-2 hover:border-foreground cursor-pointer"
      onClick={() => {
        handleServerClick(guild.id);
      }}
    >
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <ImageWithFallback
            className="rounded-full h-[40px] w-auto object-contain border"
            src={getGuildIconURL(guild)}
            alt="server icon"
            width={150}
            height={150}
            fallbackSrc="/discord/discord.png"
          />
          <div className="text-md font-medium text-center line-clamp-1 hover:underline underline-offset-2">
            {guild.name}
          </div>
        </div>
        <div className="flex items-center-gap-1 text-foreground/70">
          <Popover open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
            <PopoverTrigger>
              <div
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "rounded-md cursor-pointer",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOptionsOpen((prev) => !prev);
                }}
              >
                <FontAwesomeIcon icon={faEllipsisV} />
              </div>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-full min-w-[150px]"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="flex flex-col gap-1 w-full text-sm font-medium">
                <div
                  className={cn(
                    "cursor-pointer",
                    !session?.developerMode &&
                      "text-popover-foreground/50 cursor-not-allowed",
                  )}
                >
                  Kick bot
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-2 text-sm font-medium text-foreground/70">
        <div className="flex items-center gap-2">
          <UserRound size={16} />
          {guild.approximate_member_count} members
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success" />
          {guild.approximate_presence_count} online
        </div>
      </div>
      {guild.description && (
        <div className="text-foreground/50 font-medium text-xs line-clamp-2">
          {guild.description}
        </div>
      )}
    </div>
  );
};
