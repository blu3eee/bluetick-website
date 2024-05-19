"use client";
import type { CreateTicketPanelDto } from "@/types/bluetick/db/tickets";
import React, { useContext } from "react";
import { CollapsibleFields } from "../../../ui/collapsible-fields";
import { Label } from "@/components/ui/label";
import { GuildContext } from "@/context/guild-context";
import SelectMentions from "./select-mentions";
import { Button } from "@/components/ui/button";
import { ChannelSelect } from "../../../ui/channel-select";
import { Skeleton } from "@/components/ui/skeleton";
import { NamingScheme } from "./naming-scheme";
import { SquarePen } from "lucide-react";
import { useFetchGuildTicketSupportTeams } from "@/hooks/api/tickets/teams";
import SupportTeamSelect from "./team-select";
import MessageForm from "@/components/bluetick/ui/message-form";
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from "@/config/bluetick";
import { toast } from "sonner";

interface CreatePanelFormProps {
  serverId: string;
  handleCreatePanel: () => void;
}

const CreatePanelForm: React.FC<CreatePanelFormProps> = ({
  serverId,
  handleCreatePanel,
}) => {
  const [form, setForm] = React.useState<CreateTicketPanelDto>({
    botID: BLUETICK_BOT_ID,
    guildID: serverId,
    mentionOnOpen: [],
    namingScheme: "",
    channelID: "",
    message: { type: "Embed" },
    button: { color: "Green", text: "", emoji: "✉️" },
    welcomeMessage: { type: "Embed and Text" },
  });

  const { isLoading, discordGuild, channels, isLoadingChannels } =
    useContext(GuildContext);

  const { isLoading: isLoadingTeams, data: supportTeams } =
    useFetchGuildTicketSupportTeams(form.botID, form.guildID);

  React.useEffect(() => {
    if (supportTeams) {
      setForm((prev) => ({
        ...prev,
        supportTeamID:
          supportTeams.find((team) => team.name === `Default`)?.id ?? -1,
      }));
    }
  }, [supportTeams]);

  const handleSubmit = async (): Promise<void> => {
    console.log(form);
    // check
    const missings: string[] = [];
    if (!form.ticketCategory) {
      missings.push("ticket category");
    }
    if (!form.supportTeamID || form.supportTeamID === -1) {
      missings.push("support team");
    }
    if (form.namingScheme === "") {
      missings.push("naming scheme");
    }
    if (!form.message.embed?.title) {
      missings.push("panel message title");
    }
    if (form.button.text === "") {
      missings.push("panel button text");
    }

    if (missings.length > 0) {
      toast.error(`Missing fields:\n${missings.join(", ")}`);
      return;
    }

    // send request to create panel here
    const response = await apiInstance.post(`/${ROUTES.TICKET_PANELS}`, form);

    if (response.status === 200 || response.status === 201) {
      toast.success("New reaction panel created.");

      // refetch
      handleCreatePanel();
    } else {
      toast.error("Failed to create new reaction panel.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <CollapsibleFields label="Ticket properties" defaultOpen={true}>
        <div className="flex flex-col gap-4 pl-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex w-fit flex-col gap-2">
              <Label className="text-xs font-semibold uppercase text-gray-500">
                Ticket Panel Channel
              </Label>
              {!isLoadingChannels && channels ? (
                <ChannelSelect
                  options={channels.textChannels}
                  initChannelId={""}
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
                  initChannelId={""}
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
                  selectedTeamId={form.supportTeamID ?? -1}
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
                  selectedMentions={form.mentionOnOpen}
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
            initialMessage={form.message}
            disabledEmbedFields={["footer"]}
            buttonEmojis={discordGuild?.emojis}
            onChange={(newMessage) => {
              setForm((prev) => ({
                ...prev,
                message: newMessage,
              }));
            }}
            initButton={form.button}
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
            initialMessage={form.welcomeMessage}
            disabledEmbedFields={["footer"]}
            onChange={(newMessage) => {
              setForm((prev) => ({
                ...prev,
                welcomeMessage: newMessage,
              }));
            }}
          />
        </div>
      </CollapsibleFields>
      <div className="pl-6">
        <Button
          size={"sm"}
          onClick={() => {
            handleSubmit().catch(() => {});
          }}
          className="gap-2"
        >
          <SquarePen size={18} />
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreatePanelForm;
