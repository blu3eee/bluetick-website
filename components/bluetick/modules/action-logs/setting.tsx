"use client";
import React from "react";

import { ROUTES, apiInstance } from "@/config/bluetick";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "sonner";
import type { GuildLogSettingDetails } from "@/types/bluetick/db/bot-logs/logs-settings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LogSetting: React.FC<{
  setting: GuildLogSettingDetails;
  refetch: () => Promise<void>;
  isUpdating: boolean;
  setIsUpdating: (newValue: boolean) => void;
}> = ({ setting, refetch, isUpdating, setIsUpdating }) => {
  const [specifyChannels, setSpecifyChannels] = React.useState(false);
  // Add a state to track the update operation
  const [newAccountAge, setNewAccountAge] = React.useState(3);

  React.useEffect(() => {
    if (setting) {
      setSpecifyChannels(setting.specifyChannels);
      setNewAccountAge(setting.newAccountAge);
    }
  }, [setting]);

  const handleSpecifiedChannelChange = async (): Promise<void> => {
    if (isUpdating) {
      return;
    }
    setIsUpdating(true); // Start updating
    try {
      if (!setting) {
        toast.error(`Failed to find setting info`);
        return;
      }
      const { data } = await apiInstance.patch<{
        data: GuildLogSettingDetails;
      }>(`${ROUTES.LOG_SETTING}/${setting.id}`, {
        specifyChannels: !setting.specifyChannels,
      });
      if (data.data) {
        setSpecifyChannels(data.data.specifyChannels);
        await refetch();
        toast.success(
          `Specified channel logs ${
            data.data.specifyChannels ? "enabled" : "disabled"
          }`,
        );
      } else {
        toast.error(`Failed to update logs setting`);
      }
    } catch (e) {
      console.error(e);
      toast.error("An error happened while trying to update logs setting");
    } finally {
      setTimeout(() => {
        setIsUpdating(false); // End updating
      }, 700);
    }
  };

  const handleUpdateNewAccountAge = async (): Promise<void> => {
    if (!setting || isUpdating) return;

    setIsUpdating(true);
    try {
      await apiInstance.patch(`${ROUTES.LOG_SETTING}/${setting.id}`, {
        newAccountAge,
      });
      toast.success(`New account age updated to ${newAccountAge} days`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update new account age");
    } finally {
      setIsUpdating(false);
      await refetch();
    }
  };

  return (
    <div className="flex flex-wrap gap-8 rounded-lg bg-secondary p-4">
      <div className="flex items-center gap-2">
        <Checkbox
          id="specified-channels"
          checked={specifyChannels}
          onClick={() => {
            handleSpecifiedChannelChange().catch((e) => {});
          }}
          disabled={isUpdating} // Disable the checkbox if updating
        />
        <Label htmlFor="specified-channels" className="uppercase">
          Specified Channel For Each Event
        </Label>
      </div>
      <div className="flex max-w-[200px] flex-col gap-2">
        <Label htmlFor="new-account-age" className="uppercase">
          New Account Age (Days)
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            id="new-account-age"
            value={newAccountAge}
            onChange={(e) => {
              setNewAccountAge(Math.max(1, parseInt(e.target.value, 10) || 0));
            }}
            min="1"
            disabled={isUpdating}
          />
          <Button
            onClick={() => {
              handleUpdateNewAccountAge().catch((e) => {});
            }}
            disabled={isUpdating || newAccountAge === setting.newAccountAge}
            id="update-button" // Add CSS classes as needed
            variant={"red"}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogSetting;
