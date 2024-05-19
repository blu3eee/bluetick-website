"use client";
import React, { useContext } from "react";
import { GuildContext } from "@/context/guild-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getGuildIconURL } from "@/lib/helper";
import { Copy } from "lucide-react";
import { rubikFont } from "@/styles/fonts";
import ImageWithFallback from "@/components/custom-ui/image-with-fallback";
import { toast } from "sonner";

const GuildInfo = (): JSX.Element => {
  const { discordGuild, isLoading, channels, isLoadingChannels } =
    useContext(GuildContext);
  const copyToClipboard = (): void => {
    navigator.clipboard
      .writeText(discordGuild?.id ?? "")
      .then(() => {
        // Handle successful copy action (e.g., show a toast notification)
        console.log("ID copied to clipboard!");
      })
      .catch((err) => {
        // Handle errors (e.g., clipboard permissions denied)
        console.error("Failed to copy ID:", err);
      });
  };

  if (isLoading || !discordGuild)
    return (
      <div className="w-full">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="mt-8 flex w-full flex-wrap gap-12">
          <Skeleton className="h-8 w-36 rounded-lg" />
          <Skeleton className="h-8 w-36 rounded-lg" />
          <Skeleton className="h-8 w-36 rounded-lg" />
          <Skeleton className="h-8 w-36 rounded-lg" />
          <Skeleton className="h-8 w-36 rounded-lg" />
          <Skeleton className="h-8 w-36 rounded-lg" />
        </div>
      </div>
    );

  return (
    <div className="flex w-full max-w-[1024px] flex-col gap-4 rounded-lg border bg-secondary px-6 py-4">
      <div className="flex w-full items-center gap-4 md:gap-8">
        <ImageWithFallback
          className="h-auto w-[100px] rounded-lg md:w-[150px]"
          src={getGuildIconURL(discordGuild)}
          alt="guild avt"
          width={150}
          height={150}
          fallbackSrc="/discord/discord.png"
        />
        <div className="flex w-full flex-col gap-1">
          <span
            className={`text-2xl font-medium ${rubikFont.className} line-clamp-1`}
          >
            {discordGuild.name}
          </span>
          <div className="flex w-full flex-col items-start justify-between md:flex-row md:items-center">
            <span className="line-clamp-1 text-sm font-semibold text-gray-500">
              ID: {discordGuild.id}
            </span>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="w-fit gap-2 text-xs font-semibold text-red-400 hover:text-red-400 focus:text-red-400"
              onClick={() => {
                copyToClipboard();
                toast.info("Copied server ID");
              }}
            >
              <Copy size={16} /> Copy Server ID
            </Button>
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 items-center gap-4 md:grid-cols-3">
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

export default GuildInfo;

const InfoItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => {
  return (
    <div className="text-sm font-semibold">
      <span className="text-gray-500">{label}:</span> {value}
    </div>
  );
};
