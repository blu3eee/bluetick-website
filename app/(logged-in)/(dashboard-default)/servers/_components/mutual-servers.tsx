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
      <div className="grid w-full grid-cols-1 place-items-center justify-evenly gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-md" />
          ))}
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
    <div className="grid w-full grid-cols-1 place-items-center justify-evenly gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
      className="flex w-full cursor-pointer flex-col gap-2 rounded-md border bg-secondary p-3 transition-all duration-300 ease-in-out hover:border-foreground md:p-4"
      onClick={() => {
        handleServerClick(guild.id);
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ImageWithFallback
            className="h-[40px] w-auto rounded-full border object-contain"
            src={getGuildIconURL(guild)}
            alt="server icon"
            width={150}
            height={150}
            fallbackSrc="/discord/discord.png"
          />
          <div className="text-md line-clamp-1 text-center font-medium underline-offset-2 hover:underline">
            {guild.name}
          </div>
        </div>
        <div className="items-center-gap-1 flex text-foreground/70">
          <Popover open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
            <PopoverTrigger>
              <div
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "cursor-pointer rounded-md",
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
              <div className="flex w-full flex-col gap-1 text-sm font-medium">
                <div
                  className={cn(
                    "cursor-pointer",
                    !session?.developerMode &&
                      "cursor-not-allowed text-popover-foreground/50",
                  )}
                >
                  Kick bot
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground/70">
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
        <div className="line-clamp-2 text-xs font-medium text-foreground/50">
          {guild.description}
        </div>
      )}
    </div>
  );
};
