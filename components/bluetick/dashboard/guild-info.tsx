'use client';
import React, { useContext } from 'react';
import { GuildContext } from '@/context/guild-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getGuildIconURL } from '@/lib/helper';
import { Copy } from 'lucide-react';
import { rubikFont } from '@/styles/fonts';
import ImageWithFallback from '@/components/custom-ui/image-with-fallback';

export const GuildInfo = (): JSX.Element => {
  const { discordGuild, isLoading, channels, isLoadingChannels } =
    useContext(GuildContext);

  if (isLoading || !discordGuild)
    return (
      <div className="w-full">
        <Skeleton className="rounded-full w-24 h-24" />
        <div className="flex flex-wrap w-full gap-12 mt-8">
          <Skeleton className="rounded-lg w-36 h-8" />
          <Skeleton className="rounded-lg w-36 h-8" />
          <Skeleton className="rounded-lg w-36 h-8" />
          <Skeleton className="rounded-lg w-36 h-8" />
          <Skeleton className="rounded-lg w-36 h-8" />
          <Skeleton className="rounded-lg w-36 h-8" />
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 rounded-lg border px-6 py-4 bg-secondary w-full max-w-[1024px]">
      <div className="flex gap-8 items-center w-full">
        <ImageWithFallback
          className="rounded-lg"
          src={getGuildIconURL(discordGuild)}
          alt="guild avt"
          width={150}
          height={150}
          fallbackSrc="/discord/discord.png"
        />
        <div className="flex flex-col gap-1 w-full">
          <span className={`text-xl font-semibold ${rubikFont.className}`}>
            <span className="text-gray-400">Server:</span> {discordGuild.name}
          </span>
          <div className="flex items-start md:items-center justify-between w-full flex-col md:flex-row">
            <span className="text-md font-semibold text-gray-500">
              ID: {discordGuild.id}
            </span>
            <Button
              variant={'ghost'}
              size={'sm'}
              className="w-fit text-xs gap-2 font-semibold text-red-400 hover:text-red-400 focus:text-red-400"
            >
              <Copy size={16} /> Copy Server ID
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 items-center w-full gap-4">
        <InfoItem
          label="Members"
          value={discordGuild.approximate_member_count}
        />
        {!isLoadingChannels && channels && (
          <>
            <InfoItem label="Categories" value={channels.categories.length} />
            <InfoItem
              label="Text channels"
              value={channels.textChannels.length}
            />
            <InfoItem
              label="Voice channels"
              value={channels.voiceChannels.length}
            />
          </>
        )}
        <InfoItem label="Roles" value={discordGuild.roles.length} />
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: any }> = ({
  label,
  value,
}) => {
  return (
    <div className="text-sm font-semibold">
      <span className="text-gray-500">{label}:</span> {value}
    </div>
  );
};
