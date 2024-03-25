'use client';
import React, { useContext } from 'react';
import useMutualGuilds from '@/hooks/api/discord/mutual-guilds';
import { getBotInviteURL, getGuildIconURL } from '@/lib/helper';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Callout } from '@/components/callout';
import { BluetickContext } from '@/context/bluetick-context';
import { BLUETICK_BOT_ID } from '@/config/bluetick';
import { Button } from '@/components/ui/button';
import ImageWithFallback from '@/components/custom-ui/image-with-fallback';

export const MutualServers = (): JSX.Element => {
  const { botDetails, isLoading: isLoadingBluetick } =
    useContext(BluetickContext);
  const { mutualGuilds, loadingState: isLoading, error } = useMutualGuilds();
  const router = useRouter();

  if (isLoading !== 'completed') {
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
        {isLoadingBluetick ? (
          <Skeleton className="h-12 w-full" />
        ) : botDetails ? (
          <a href={getBotInviteURL(botDetails.botID ?? BLUETICK_BOT_ID)}>
            <Button>Invite bot to your server</Button>
          </a>
        ) : null}
      </div>
    );
  }

  const handleServerClick = (serverId: string): void => {
    router.push(`/dashboard/${serverId}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-2 place-items-center	">
      {mutualGuilds.map((guild) => {
        return (
          <div
            key={guild.id}
            className="flex flex-col items-center justify-center cursor-pointer mb-4 bg-secondary hover:bg-secondary/70 px-3 md:px-4 py-2 rounded-lg w-fit"
            onClick={() => {
              handleServerClick(guild.id);
            }}
          >
            <ImageWithFallback
              className="rounded-lg h-[128px] w-auto object-contain"
              src={getGuildIconURL(guild)}
              alt="server icon"
              width={150}
              height={150}
              fallbackSrc="/discord/discord.png"
            />
            <div className="text-md mt-2 font-semibold text-center">
              {guild.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
