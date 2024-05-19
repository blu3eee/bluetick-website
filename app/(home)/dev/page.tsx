"use client";
import VercelData from "@/components/dev/vercel-analytics";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { BLUETICK_BOT_ID } from "@/config/bluetick";
import { BluetickContext } from "@/context/bluetick-context";
import { useFetchBotGuilds } from "@/hooks/api/discord/bot-guilds";

import React, { useContext } from "react";

const DevPage = (): JSX.Element => {
  const { botDetails, isLoading: isLoadingBot } = useContext(BluetickContext);

  const { data: guilds, isLoading: isLoadingGuilds } =
    useFetchBotGuilds(BLUETICK_BOT_ID);

  if (isLoadingBot || !botDetails) {
    return <div>Loading bot Info</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoadingGuilds || !guilds ? (
        <Skeleton className="h-36 w-full" />
      ) : (
        <div className="flex flex-col gap-2 rounded-lg bg-secondary p-4">
          <Label className="uppercase text-red-400">Guilds Stat</Label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label>Total guilds:</Label>
              <span className="text-sm font-semibold text-blue-500">
                {guilds.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Label>Total members:</Label>
              <span className="text-sm font-semibold text-blue-500">
                {guilds.reduce(
                  (acc, guild) => acc + guild.approximate_member_count,
                  0,
                )}
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <a href="/dev/playground">
          <Button size={"sm"} variant={"warning"}>
            Playground
          </Button>
        </a>
        <a href="/dev/twitch">
          <Button
            size={"sm"}
            className="bg-twitch text-twitch-foreground hover:bg-twitch-secondary focus:bg-twitch-secondary transition duration-200 ease-in-out"
          >
            Twitch
          </Button>
        </a>
      </div>
      <VercelData />
    </div>
  );
};

export default DevPage;
