"use client";
import { ChannelSelect } from "@/components/bluetick/ui/channel-select";
import { CollapsibleFields } from "@/components/bluetick/ui/collapsible-fields";
import MessageForm from "@/components/bluetick/ui/message-form";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { GuildContext } from "@/context/guild-context";
import { useFetchGuildTicketSupportTeams } from "@/hooks/api/tickets/teams";
import type {
  TicketPanelDetails,
  UpdateTicketPanelDto,
} from "@/types/bluetick/db/tickets";

import React, { useContext } from "react";
import SelectMentions from "./select-mentions";
import { NamingScheme } from "./naming-scheme";
import SupportTeamSelect from "./team-select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ROUTES, apiInstance } from "@/config/bluetick";

interface EditPanelDialogProps {
  panel: TicketPanelDetails;
  trigger?: React.ReactNode;
  refetch?: () => void;
}

const EditPanelDialog: React.FC<EditPanelDialogProps> = ({
  panel,
  trigger,
  refetch,
}) => {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<UpdateTicketPanelDto>({});
  const { isLoading, discordGuild, channels, isLoadingChannels } =
    useContext(GuildContext);

  const { isLoading: isLoadingTeams, data: supportTeams } =
    useFetchGuildTicketSupportTeams(panel.bot.botID, panel.guild.guildID);

  const handleUpdate = async (): Promise<void> => {
    const missings: string[] = [];
    if (form.button && !form.button.text) {
      missings.push("panel button text");
    }
    if (form.channelID && form.channelID === "") {
      missings.push("panel channel");
    }
    if (form.message?.embed?.title === "") {
      missings.push("panel message title");
    }
    if (form.namingScheme && form.namingScheme === "") {
      missings.push("naming scheme");
    }

    if (missings.length > 0) {
      toast.error(`Missing fields:\n${missings.join(", ")}`);
      return;
    }

    // send request to create panel here
    const response = await apiInstance.patch(
      `/${ROUTES.TICKET_PANELS}/${panel.id}`,
      form,
    );

    if (response.status === 200 || response.status === 201) {
      toast.success("Ticket panel updated.");
      if (refetch) {
        refetch();
      }
    } else {
      toast.error("Failed to update ticket panel.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger ?? "Edit"}</DialogTrigger>
      <DialogContent className="h-3/4 max-w-[1024px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit ticket panel: (id){" "}
            <span className="text-blue-500">{panel.id}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex h-fit w-full flex-col justify-start gap-2">
          <CollapsibleFields label="Ticket properties" defaultOpen={true}>
            <div className="flex flex-col gap-4 pl-6">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex w-fit flex-col gap-2">
                  <Label className="text-xs font-semibold uppercase text-gray-500">
                    Ticket Panel Channel
                  </Label>
                  {!isLoadingChannels && channels ? (
                    <ChannelSelect
                      options={channels.textChannels}
                      initChannelId={panel.channelID}
                      onSelect={(newId: string) => {
                        setForm((prev) => ({
                          ...prev,
                          channelID: newId,
                        }));
                      }}
                    />
                  ) : (
                    <Skeleton className="h-10 w-full" />
                  )}
                </div>
                <div className="flex w-fit flex-col gap-2">
                  <Label className="text-xs font-semibold uppercase text-gray-500">
                    Ticket Category
                  </Label>
                  {!isLoadingChannels && channels ? (
                    <ChannelSelect
                      options={channels.categories}
                      initChannelId={panel.ticketCategory ?? ""}
                      onSelect={(newId: string) => {
                        setForm((prev) => ({
                          ...prev,
                          ticketCategory: newId,
                        }));
                      }}
                    />
                  ) : (
                    <Skeleton className="h-10 w-full" />
                  )}
                </div>
                <div className="flex w-fit flex-col gap-2">
                  <Label className="text-xs font-semibold uppercase text-gray-500">
                    Support Team
                  </Label>
                  {isLoadingTeams || !supportTeams ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <SupportTeamSelect
                      options={supportTeams}
                      selectedTeamId={panel.supportTeam.id ?? -1}
                      onSelect={(newId) => {
                        setForm((prev) => ({
                          ...prev,
                          supportTeamID: newId,
                        }));
                      }}
                    />
                  )}
                </div>

                <div className="flex w-full flex-col gap-2 md:w-fit md:min-w-[250px]">
                  <Label className="text-xs font-semibold uppercase text-gray-500">
                    Mention on open
                  </Label>
                  {isLoading || !discordGuild ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <SelectMentions
                      roles={discordGuild.roles ?? []}
                      selectedMentions={panel.mentionOnOpen}
                      onMentionsChange={(newMentions) => {
                        setForm((prev) => ({
                          ...prev,
                          mentionOnOpen: newMentions,
                        }));
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold uppercase text-gray-500">
                    Naming scheme
                  </Label>
                  <NamingScheme
                    initScheme={panel.namingScheme}
                    onNamingChange={(newValue) => {
                      setForm((prev) => ({
                        ...prev,
                        namingScheme: newValue,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </CollapsibleFields>
          <CollapsibleFields label="Panel Message" defaultOpen={true}>
            <div className="pl-6">
              <MessageForm
                type={"Embed"}
                initialMessage={panel.message}
                disabledEmbedFields={["footer"]}
                buttonEmojis={discordGuild?.emojis}
                onChange={(newMsg) => {
                  setForm((prev) => ({
                    ...prev,
                    message: newMsg,
                  }));
                }}
                initButton={panel.button}
                onButtonChange={(newButton) => {
                  setForm((prev) => ({
                    ...prev,
                    button: newButton,
                  }));
                }}
              />
            </div>
          </CollapsibleFields>
          <CollapsibleFields label="Panel Message">
            <div className="pl-6">
              <MessageForm
                type={"Embed and Text"}
                initialMessage={panel.welcomeMessage}
                disabledEmbedFields={["footer"]}
                onChange={(newMsg) => {
                  setForm((prev) => ({
                    ...prev,
                    welcomeMessage: newMsg,
                  }));
                }}
              />
            </div>
          </CollapsibleFields>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              onClick={() => {
                handleUpdate().catch(() => {
                  console.error("failed to handle update");
                });
              }}
            >
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPanelDialog;
