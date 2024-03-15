'use client';
import React, { useContext } from 'react';
import useMutualGuilds from '@/hooks/api/discord/mutual-guilds';
import { getBotInviteURL, getGuildIconURL } from '@/lib/helper';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Callout } from '@/components/callout';
import Image from 'next/image';
import { BluetickContext } from '@/context/bluetick-context';
import { BLUETICK_BOT_ID } from '@/config/bluetick';
import { Button } from '@/components/ui/button';

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 w-full gap-2">
      {mutualGuilds.map((guild) => (
        <div
          key={guild.id}
          className="flex flex-col items-center justify-center cursor-pointer mb-4"
          onClick={() => {
            handleServerClick(guild.id);
          }}
        >
          <Image
            className="rounded-lg aspect-square h-[128px]"
            src={getGuildIconURL(guild)}
            alt="server icon"
            width={150}
            height={150}
            priority
          />
          <div className="text-lg mt-2">{guild.name}</div>
        </div>
      ))}
    </div>
  );
};
