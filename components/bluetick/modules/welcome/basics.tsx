"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from "@/config/bluetick";
import { GuildContext } from "@/context/guild-context";
import { useFetchGuildWelcome } from "@/hooks/api/welcome/fetch";
import React, { useContext } from "react";
import { toast } from "sonner";
import { ChannelSelect } from "../../ui/channel-select";
import { Skeleton } from "@/components/ui/skeleton";

const TypeAndChannel: React.FC<{
  type: string;
  serverId: string;
  setType: (new_val: string) => void;
}> = ({ type: initType, serverId, setType }) => {
  const { channels, isLoadingChannels } = useContext(GuildContext);
  const { data: guildWelcome, refetch } = useFetchGuildWelcome(
    BLUETICK_BOT_ID,
    serverId,
  );

  const handleChange = async (newType: string): Promise<void> => {
    // Send the patch request to update the message type
    try {
      console.log({ message: { type: newType } });
      const response = await apiInstance.patch(
        `${ROUTES.BOTGUILDWELCOMES}/${BLUETICK_BOT_ID}/${serverId}`,
        { message: { type: newType } },
      );
      if (response.status === 200) {
        setType(newType);
        await refetch();
        toast.success(`Message type set to ${newType} successful`);
      } else {
        toast.error("Failed to update message type");
      }
    } catch (error) {
      console.error(error);
      toast.error(`An error happened while trying to update message type`);
    }
  };

  const handleChannelSelect = async (channelID: string): Promise<void> => {
    // Send the patch request to update the message type
    try {
      const response = await apiInstance.patch(
        `${ROUTES.BOTGUILDWELCOMES}/${BLUETICK_BOT_ID}/${serverId}`,
        { channelID },
      );
      if (response.status === 200) {
        console.log(response.data.data);
        toast.success(`Set new welcome channel successful.`);
      } else {
        toast.error("Failed to update welcome message channel");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        `An error happened while trying to update welcome message type`,
      );
    }
  };

  return (
    <div className="flex gap-2">
      <div className="bg-secondary rounded-lg p-4 w-4/5">
        <Label className="uppercase">Message type</Label>
        <RadioGroup
          onValueChange={(val) => {
            handleChange(val).catch((e) => {
              console.error("Failed to handle radio group change", e);
            });
          }}
          defaultValue={initType}
          className="flex flex-wrap gap-4 mt-4 justify-between"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="Message"
              id="Message"
              className="text-green-500"
            />
            <Label htmlFor="Message">Message</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Embed" id="Embed" />
            <Label htmlFor="Embed">Embed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Embed and Text" id="Embed and Text" />
            <Label htmlFor="Embed and Text">Embed and Text</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="bg-secondary rounded-lg p-4 w-full ">
        <Label className="uppercase">Welcome Channel</Label>
        {isLoadingChannels || !channels ? (
          <Skeleton className="w-full h-12" />
        ) : (
          <div className="mt-2">
            <ChannelSelect
              options={channels.textChannels}
              initChannelId={guildWelcome?.channelID ?? ""}
              onSelect={(id) => {
                handleChannelSelect(id).catch((error) => {
                  console.error("Failed to handle select channel", error);
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TypeAndChannel;
