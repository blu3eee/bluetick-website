"use client";
import React, { useContext } from "react";
import type { ServerIdProps } from "../props";
import { useFetchGuildTicketSupportTeams } from "@/hooks/api/tickets/teams";
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from "@/config/bluetick";
import type { TicketSupportTeamDetails } from "@/types/bluetick/db/tickets";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchGuildMembers } from "@/hooks/api/discord/guild-members";
import type { DiscordGuildMember, DiscordRole } from "@/types/bluetick/discord";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { GuildContext } from "@/context/guild-context";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";

const SupportTeams: React.FC<ServerIdProps> = ({ serverId }) => {
  const { discordGuild, isLoading } = useContext(GuildContext);

  const {
    data,
    refetch,
    isLoading: isLoadingTeams,
  } = useFetchGuildTicketSupportTeams(BLUETICK_BOT_ID, serverId);

  const [teams, setTeams] = React.useState<TicketSupportTeamDetails[]>([]);
  const [selectedTeam, setSelectedTeam] =
    React.useState<TicketSupportTeamDetails | null>(null);

  React.useEffect(
    () => {
      if (data) {
        setTeams(data);
        setSelectedTeam(
          data.find((team) => team.name === selectedTeam?.name ?? `Default`) ??
            data[0],
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  const { data: members, isLoading: isLoadingMembers } = useFetchGuildMembers(
    BLUETICK_BOT_ID,
    serverId,
  );

  const [selectedMember, setSelectedMember] =
    React.useState<DiscordGuildMember | null>(null);

  const [selectedRole, setSelectedRole] = React.useState<DiscordRole | null>(
    null,
  );

  const handleAddRole = async (): Promise<void> => {
    try {
      if (!selectedRole) {
        toast.error("No role selected");
        return;
      }

      if (selectedTeam) {
        const response = await apiInstance.patch(
          `${ROUTES.TICKET_SUPPORT_TEAMS}/${selectedTeam.id}`,
          {
            roles: [...selectedTeam.roles, selectedRole.id],
          },
        );
        if (response.status === 200 || response.status === 201) {
          await refetch();
          toast.success(
            `[Team: ${selectedTeam.name}] User @${selectedRole.name} added`,
          );
          setSelectedRole(null);
        }
      } else {
        toast.error("No team selected");
      }
    } catch (e) {
      toast.error("An error happened while trying to update staff team.");
    }
  };

  const handleAddUser = async (): Promise<void> => {
    try {
      if (!selectedMember) {
        toast.error("No user selected");
        return;
      }
      if (selectedTeam) {
        const response = await apiInstance.patch(
          `${ROUTES.TICKET_SUPPORT_TEAMS}/${selectedTeam.id}`,
          {
            users: [...selectedTeam.users, selectedMember.user.id],
          },
        );
        if (response.status === 200 || response.status === 201) {
          await refetch();
          toast.success(
            `[Team: ${selectedTeam.name}] User @${selectedMember.user.username} added`,
          );
          setSelectedMember(null);
        }
      } else {
        toast.error("No team selected");
      }
    } catch (e) {
      toast.error("An error happened while trying to update staff team.");
    }
  };

  const handleDeleteUser = async (id: string): Promise<void> => {
    try {
      if (selectedTeam) {
        const response = await apiInstance.patch(
          `${ROUTES.TICKET_SUPPORT_TEAMS}/${selectedTeam.id}`,
          {
            users: selectedTeam.users.filter((userId) => userId !== id),
          },
        );
        if (response.status === 200 || response.status === 201) {
          await refetch();
          toast.success(`[Team: ${selectedTeam.name}] User removed`);
        } else {
          toast.error(`[Team: ${selectedTeam.name}] Failed to remove user`);
        }
      } else {
        toast.error("No team selected");
      }
    } catch (e) {
      toast.error("An error happened while trying to update staff team.");
    }
  };

  const handleDeleteRole = async (id: string): Promise<void> => {
    try {
      if (selectedTeam) {
        const response = await apiInstance.patch(
          `${ROUTES.TICKET_SUPPORT_TEAMS}/${selectedTeam.id}`,
          {
            roles: selectedTeam.roles.filter((roleId) => roleId !== id),
          },
        );
        if (response.status === 200 || response.status === 201) {
          await refetch();
          toast.success(`[Team: ${selectedTeam.name}] Role removed`);
        } else {
          toast.error(`[Team: ${selectedTeam.name}] Failed to remove role`);
        }
      } else {
        toast.error("No team selected");
      }
    } catch (e) {
      toast.error("An error happened while trying to update staff team roles.");
    }
  };

  const [newTeamName, setNewTeamName] = React.useState("");

  const handleAddTeam = async (): Promise<void> => {
    try {
      if (newTeamName === "") {
        toast.error("Invalid team name: empty");
        return;
      }

      if (newTeamName.toLowerCase() === "default") {
        toast.error("Invalid team name: cannot use name Default");
        return;
      }

      if (
        teams.find(
          (team) =>
            team.name.trim().toLowerCase() === newTeamName.trim().toLowerCase(),
        )
      ) {
        toast.error("Invalid team name: existed team name");
        return;
      }

      const { data } = await apiInstance.post<{
        data: TicketSupportTeamDetails | null;
      }>(`${ROUTES.TICKET_SUPPORT_TEAMS}`, {
        botID: BLUETICK_BOT_ID,
        guildID: serverId,
        name: newTeamName,
        roles: [],
        users: [],
      });
      const newTeam = data.data;
      if (newTeam) {
        console.log("created team data", newTeam);
        await refetch();
        toast.success(`Team added: ${newTeamName}`);
        setNewTeamName("");
      } else {
        toast.error(`Failed to add new team`);
      }
    } catch (e) {
      toast.error("An error happened while trying to create new staff team.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-col gap-2 rounded-lg bg-secondary p-4">
        <Label
          id="new-team-input"
          className="font-semibold uppercase text-red-400"
        >
          Add a new staff team
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="new-team-input"
            placeholder="New team name"
            className="w-fit"
            value={newTeamName}
            onChange={(e) => {
              setNewTeamName(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              handleAddTeam().catch(() => {});
            }}
            disabled={newTeamName === ""}
          >
            Add new
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 rounded-lg bg-secondary p-4">
        <Label className="font-semibold uppercase text-red-400">
          Manage teams
        </Label>
        <div className="flex w-full items-center gap-2">
          {isLoadingTeams || !data || !selectedTeam ? (
            <Skeleton className="h-8 w-full bg-background" />
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex min-h-10 min-w-[200px] cursor-pointer items-center justify-between rounded-md border bg-background/80 px-4 py-2">
                  {selectedTeam?.name}
                  <ChevronsUpDown size={16} />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search team..."
                    className="h-9 w-full"
                  />
                  <CommandEmpty>No team found</CommandEmpty>
                  <CommandGroup className="max-h-[300px] w-full overflow-y-auto">
                    {teams.map((team) => (
                      <CommandItem
                        key={team.id}
                        id={team.name}
                        value={team.name}
                        onSelect={(teamName) => {
                          const newSelectedTeam = teams.find(
                            (team) => team.name === teamName,
                          );
                          if (newSelectedTeam) {
                            setSelectedTeam(newSelectedTeam);
                            toast.info(`Team ${teamName} selected`);
                          }
                        }}
                        className="w-full"
                      >
                        {team.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}
          <Button
            variant={"destructive"}
            disabled={!selectedTeam || selectedTeam.name === `Default`}
          >
            Delete
          </Button>
        </div>
        <div className="flex w-full flex-col items-start gap-4 md:flex-row">
          <div className="flex flex-col gap-2">
            <Label className="text-gray-500">Roles</Label>
            <div className="flex items-center gap-2">
              {isLoading || !discordGuild ? (
                <Skeleton className="h-8 w-[200px] bg-background" />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex min-h-10 w-full min-w-[200px] cursor-pointer items-center justify-between rounded-md border bg-background/80 px-4 py-2">
                      {selectedRole ? (
                        selectedRole.name
                      ) : (
                        <span className="text-gray-500">Select role</span>
                      )}
                      <ChevronsUpDown size={16} />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search role..."
                        className="h-9 w-full"
                      />
                      <CommandEmpty>No role found</CommandEmpty>
                      <CommandGroup className="max-h-[300px] w-full overflow-y-auto">
                        {discordGuild.roles
                          .filter(
                            (role) => !selectedTeam?.roles.includes(role.id),
                          )
                          .map((role) => (
                            <CommandItem
                              key={role.id}
                              value={`${role.id}_${role.name.toLowerCase()}`}
                              onSelect={(currentValue) => {
                                const selectedValue = discordGuild.roles.find(
                                  (option) =>
                                    `${option.id}_${option.name}`.toLowerCase() ===
                                    currentValue,
                                );
                                if (selectedValue) {
                                  setSelectedRole(
                                    selectedRole &&
                                      selectedValue.id === selectedRole.id
                                      ? null
                                      : selectedValue,
                                  );
                                }
                              }}
                              className="w-full"
                            >
                              {role.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  selectedRole && selectedRole.id === role.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
              <Button
                size={"sm"}
                disabled={selectedRole === null}
                onClick={() => {
                  handleAddRole().catch((e) => {
                    console.log(e);
                    console.log(
                      "an error happened while trying to add a role to the team",
                    );
                  });
                }}
              >
                Add
              </Button>
            </div>
            {selectedTeam && (
              <div className="flex flex-wrap items-center gap-1">
                {selectedTeam.roles.map((roleId, index) => {
                  const role = discordGuild?.roles.find((r) => r.id === roleId);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg bg-background px-2 py-1"
                    >
                      {role ? `@${role.name}` : roleId}
                      <Icons.close
                        size={24}
                        className="cursor-pointer rounded-lg p-1 hover:bg-secondary"
                        onClick={() => {
                          handleDeleteRole(roleId).catch(() => {});
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            <Label className="text-gray-500">Members</Label>
            <div className="flex items-center gap-2">
              {isLoadingMembers || !members ? (
                <Skeleton className="h-8 w-[200px] bg-background" />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex min-h-10 min-w-[200px] cursor-pointer items-center justify-between rounded-md border bg-background/80 px-4 py-2">
                      {selectedMember ? (
                        `${
                          selectedMember.user.global_name ??
                          selectedMember.user.username
                        } (@${selectedMember.user.username})`
                      ) : (
                        <span className="text-gray-500">Select user</span>
                      )}
                      <ChevronsUpDown size={16} />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search user..."
                        className="h-9 w-full"
                      />
                      <CommandEmpty>No user found</CommandEmpty>
                      <CommandGroup className="max-h-[300px] w-full overflow-y-auto">
                        {members.map((mem) => (
                          <CommandItem
                            key={mem.user.id}
                            value={`${
                              mem.user.id
                            }_${mem.user.username.toLowerCase()}`}
                            onSelect={(currentValue) => {
                              const selectedValue = members.find(
                                (option) =>
                                  `${option.user.id}_${option.user.username}`.toLowerCase() ===
                                  currentValue,
                              );
                              if (selectedValue) {
                                setSelectedMember(
                                  selectedMember &&
                                    selectedValue.user.id ===
                                      selectedMember.user.id
                                    ? null
                                    : selectedValue,
                                );
                              }
                            }}
                            className="w-full"
                          >
                            {`${mem.user.global_name ?? mem.user.username} (@${
                              mem.user.username
                            })`}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedMember &&
                                  selectedMember.user.id === mem.user.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
              <Button
                size={"sm"}
                disabled={selectedMember === null}
                onClick={() => {
                  handleAddUser().catch((e) => {
                    console.log("error happened while adding user to the team");
                  });
                }}
              >
                Add
              </Button>
            </div>
            {selectedTeam && (
              <div className="flex flex-wrap items-center gap-1">
                {selectedTeam.users.map((userId, index) => {
                  const mem = members?.find((m) => m.user.id === userId);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg bg-background px-2 py-1"
                    >
                      {mem ? `@${mem.user.username}` : `<@${userId}>`}
                      <Icons.close
                        size={24}
                        className="cursor-pointer rounded-lg p-1 hover:bg-secondary"
                        onClick={() => {
                          handleDeleteUser(userId).catch(() => {});
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTeams;
