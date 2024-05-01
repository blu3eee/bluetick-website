import React, { useContext, useEffect, useState } from "react";
import type { ServerIdProps } from "../props";
import { Label } from "@/components/ui/label";
import { ChannelsMultiSelect } from "../../ui/channels-multiselect";
import { GuildContext } from "@/context/guild-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchGuildLogIgnores } from "@/hooks/api/bot-logs/log-ignores";
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from "@/config/bluetick";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import RolesMultiSelect from "../../ui/roles-multiselect";

const Ignores: React.FC<ServerIdProps & { logSettingId: number }> = ({
  serverId,
  logSettingId,
}) => {
  const { discordGuild, isLoading, channels, isLoadingChannels } =
    useContext(GuildContext);
  const {
    data: ignores,
    isLoading: isLoadingIgnores,
    refetch,
  } = useFetchGuildLogIgnores(BLUETICK_BOT_ID, serverId);

  const [ignoredChannels, setIgnoredChannels] = useState<string[]>([]);
  const [ignoredRoles, setIgnoredRoles] = useState<string[]>([]);

  // Store the initial state for comparison
  const [initialIgnoredChannels, setInitialIgnoredChannels] = useState<
    string[]
  >([]);
  const [initialIgnoredRoles, setInitialIgnoredRoles] = useState<string[]>([]);

  useEffect(() => {
    if (ignores) {
      const channelIDs = ignores.channels.map((c) => c.channelID);
      const roleIDs = ignores.roles.map((role) => role.roleID);
      setIgnoredChannels(channelIDs);
      setIgnoredRoles(roleIDs);
      // Update initial states
      setInitialIgnoredChannels(channelIDs);
      setInitialIgnoredRoles(roleIDs);
    }
  }, [ignores]);

  // Function to compare initial and current states
  const hasChannelsChanges = (): boolean => {
    return (
      initialIgnoredChannels.sort().join(",") !==
      ignoredChannels.sort().join(",")
    );
  };

  // Function to compare initial and current states
  const hasRolesChanges = (): boolean => {
    return (
      initialIgnoredRoles.sort().join(",") !== ignoredRoles.sort().join(",")
    );
  };

  const handleSaveChannels = async (): Promise<void> => {
    try {
      if (!ignores) {
        return;
      }
      const deletes = ignores.channels
        .filter((ig) => !ignoredChannels.includes(ig.channelID))
        .map((i) => i.id);
      const adds = ignoredChannels.filter(
        (id) => !ignores.channels.find((i) => i.channelID === id),
      );
      const response = await apiInstance.patch(
        `${ROUTES.LOG_SETTING}/channels/${logSettingId}`,
        { deletes, adds },
      );

      if (response.status === 200) {
        await refetch();
        toast.success(`Log channel ignores updated`);
      } else {
        toast.error(`Failed to update log channel ignores`);
      }
    } catch (e) {
      toast.error(`An error happened while updating log channel ignores`);
    }
  };

  const handleSaveRoles = async (): Promise<void> => {
    try {
      if (!ignores) {
        return;
      }
      const deletes = ignores.roles
        .filter((ig) => !ignoredRoles.includes(ig.roleID))
        .map((i) => i.id);
      const adds = ignoredRoles.filter(
        (id) => !ignores.roles.find((i) => i.roleID === id),
      );
      const response = await apiInstance.patch(
        `${ROUTES.LOG_SETTING}/roles/${logSettingId}`,
        { deletes, adds },
      );

      if (response.status === 200) {
        await refetch();
        toast.success(`Log role ignores updated`);
      } else {
        toast.error(`Failed to update log role ignores`);
      }
    } catch (e) {
      toast.error(`An error happened while updating log role ignores`);
    }
  };

  return (
    <>
      <div className="bg-secondary rounded-lg p-4 flex flex-col gap-2">
        <Label className="uppercase font-semibold">Ignored Channels</Label>
        <span className="text-sm text-foreground/80">
          Events will not be logged for these channels.
        </span>
        {isLoadingChannels || !channels ? (
          <Skeleton className="w-full h-10" />
        ) : (
          <ChannelsMultiSelect
            options={channels.textChannels}
            selectedChannels={ignoredChannels}
            onSelect={setIgnoredChannels}
          />
        )}
        <Button
          className="w-fit"
          variant={"red"}
          disabled={!hasChannelsChanges() || isLoadingIgnores}
          onClick={() => {
            handleSaveChannels().catch((e) => {});
          }}
        >
          Save
        </Button>
      </div>
      <div className="bg-secondary rounded-lg p-4 flex flex-col gap-2">
        <Label className="uppercase font-semibold">Ignored Roles</Label>
        <span className="text-sm text-foreground/80">
          Deleted messages will not be logged for these roles.
        </span>
        {isLoading || !discordGuild ? (
          <Skeleton className="w-full h-10" />
        ) : (
          <RolesMultiSelect
            options={discordGuild.roles}
            selectedRoles={ignoredRoles}
            onSelect={setIgnoredRoles}
          />
        )}
        <Button
          className="w-fit"
          variant={"red"}
          disabled={!hasRolesChanges() || isLoadingIgnores}
          onClick={() => {
            handleSaveRoles().catch((e) => {});
          }}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default Ignores;
