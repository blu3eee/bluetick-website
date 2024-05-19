"use client";
import React from "react";
import type { ServerIdProps } from "../props";
import LogSetting from "./setting";
import { useFetchGuildLogSetting } from "@/hooks/api/bot-logs/logs-settings";
import { BLUETICK_BOT_ID } from "@/config/bluetick";
import { Skeleton } from "@/components/ui/skeleton";
import OneLogChannel from "./one-log-channel";
import Ignores from "./ignores";
import SpecifiedLogChannels from "./specified-log-channel";

/**
 * Replaces the character at the specified index in the given string with the provided character.
 * @param {string} str - The input string.
 * @param {number} index - The index of the character to be replaced.
 * @param {string} chr - The character to replace the character at the specified index.
 * @returns {string} A new string with the character replaced or the original string if the index is out of range.
 */
export function setCharAt(str: string, index: number, chr: string): string {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

const BotLogs: React.FC<ServerIdProps> = ({ serverId }) => {
  const {
    data: setting,
    isLoading,
    refetch,
  } = useFetchGuildLogSetting(BLUETICK_BOT_ID, serverId);

  const [isUpdating, setIsUpdating] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      {isLoading || !setting ? (
        <Skeleton className="h-36 w-full" />
      ) : (
        <LogSetting
          setting={setting}
          refetch={async () => {
            await refetch();
          }}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
        />
      )}
      {isLoading || !setting || isUpdating ? (
        <Skeleton className="h-36 w-full" />
      ) : setting.specifyChannels ? (
        <SpecifiedLogChannels serverId={serverId} />
      ) : (
        <OneLogChannel serverId={serverId} />
      )}
      {isLoading || !setting ? (
        <Skeleton className="h-36 w-full" />
      ) : (
        <Ignores serverId={serverId} logSettingId={setting.id} />
      )}
    </div>
  );
};

export default BotLogs;
