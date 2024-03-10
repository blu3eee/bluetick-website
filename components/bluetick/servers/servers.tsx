'use client';
import React from 'react';
import useMutualGuilds from '@/hooks/api/discord/mutual-guilds';
import { getGuildIconURL } from '@/lib/helper';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Callout } from '@/components/callout';
import Image from 'next/image';

export const MutualServers = (): JSX.Element => {
  const { mutualGuilds, isLoading, error } = useMutualGuilds();
  const router = useRouter();
  if (isLoading) {
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

  if (!Array.isArray(mutualGuilds)) {
    return <div>No mutual servers found.</div>;
  }

  const handleServerClick = (serverId: string): void => {
    router.push(`/dashboard/${serverId}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 w-full gap-2">
      {mutualGuilds.length > 0 ? (
        mutualGuilds.map((guild) => (
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
            />
            <div className="text-lg mt-2">{guild.name}</div>
          </div>
        ))
      ) : (
        <div>No mutual servers found.</div>
      )}
    </div>
  );
};
