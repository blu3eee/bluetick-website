'use client';
import React, { useContext } from 'react';
import type { ServerIdProps } from '../props';
import { useFetchGuildTicketSupportTeams } from '@/hooks/api/tickets/teams';
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from '@/config/bluetick';
import type { TicketSupportTeamDetails } from '@/types/bluetick/db/tickets';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFetchGuildMembers } from '@/hooks/api/discord/guild-members';
import type { DiscordGuildMember, DiscordRole } from '@/types/bluetick/discord';
import { PopoverContent } from '@radix-ui/react-popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { GuildContext } from '@/context/guild-context';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';

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

  React.useEffect(() => {
    if (data) {
      setTeams(teams);
      setSelectedTeam(data.find((team) => team.name === `Default`) ?? data[0]);
    }
  }, [data, teams]);

  const { data: members, isLoading: isLoadingMembers } = useFetchGuildMembers(
    BLUETICK_BOT_ID,
    serverId
  );

  const [selectedMember, setSelectedMember] =
    React.useState<DiscordGuildMember | null>(null);

  const [selectedRole, setSelectedRole] = React.useState<DiscordRole | null>(
    null
  );

  const handleAddRole = async (): Promise<void> => {
    try {
      if (!selectedRole) {
        toast.error('No role selected');
        return;
      }
      if (selectedTeam) {
        const response = await apiInstance.patch(
          `${ROUTES.TICKET_SUPPORT_TEAMS}/${selectedTeam.id}`,
          {
            roles: [...selectedTeam.roles, selectedRole.id],
          }
        );
        if (response.status === 200 || response.status === 201) {
          await refetch();
          toast.success(
            `[Team: ${selectedTeam.name}] User @${selectedRole.name} added`
          );
          setSelectedRole(null);
        }
      } else {
        toast.error('No team selected');
      }
    } catch (e) {
      toast.error('An error happened while trying to update staff team.');
    }
  };

  const handleAddUser = async (): Promise<void> => {
    try {
      if (!selectedMember) {
        toast.error('No user selected');
        return;
      }
      if (selectedTeam) {
        const response = await apiInstance.patch(
          `${ROUTES.TICKET_SUPPORT_TEAMS}/${selectedTeam.id}`,
          {
            roles: [...selectedTeam.users, selectedMember.user.id],
          }
        );
        if (response.status === 200 || response.status === 201) {
          await refetch();
          toast.success(
            `[Team: ${selectedTeam.name}] Role @${selectedMember.user.username} added`
          );
          setSelectedMember(null);
        }
      } else {
        toast.error('No team selected');
      }
    } catch (e) {
      toast.error('An error happened while trying to update staff team.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-secondary p-4 flex flex-col gap-2 w-full">
        <Label className="uppercase text-red-400 font-semibold">
          Manage teams
        </Label>
        <div className="flex gap-2 items-center w-full">
          {isLoadingTeams || !data || !selectedTeam ? (
            <Skeleton className="w-1/2 h-8 bg-background" />
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div className="min-h-10 min-w-[200px] flex items-center justify-between rounded-md border py-2 px-4 bg-background/80 cursor-pointer">
                  {selectedTeam?.name}
                  <ChevronsUpDown size={16} />
                </div>
              </PopoverTrigger>
            </Popover>
          )}
          <Button
            variant={'destructive'}
            disabled={!selectedTeam || selectedTeam.name === `Default`}
          >
            Delete
          </Button>
        </div>
        <div className="flex flex-col md:flex-row items-start w-full gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-gray-500">Roles</Label>
            <div className="flex items-center gap-2">
              {isLoading || !discordGuild ? (
                <Skeleton className="w-[200px] h-8 bg-background" />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="min-h-10 min-w-[200px] flex items-center justify-between rounded-md border py-2 px-4 bg-background/80 cursor-pointer w-full">
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
                      <CommandGroup className="max-h-[300px] overflow-y-auto w-full">
                        {discordGuild.roles.map((role) => (
                          <CommandItem
                            key={role.id}
                            value={`${role.id}_${role.name.toLowerCase()}`}
                            onSelect={(currentValue) => {
                              const selectedValue = discordGuild.roles.find(
                                (option) =>
                                  `${option.id}_${option.name}`.toLowerCase() ===
                                  currentValue
                              );
                              if (selectedValue) {
                                setSelectedRole(
                                  selectedRole &&
                                    selectedValue.id === selectedRole.id
                                    ? null
                                    : selectedValue
                                );
                              }
                            }}
                            className="w-full"
                          >
                            {role.name}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                selectedRole && selectedRole.id === role.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
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
                size={'sm'}
                disabled={selectedRole === null}
                onClick={() => {
                  handleAddRole().catch((e) => {
                    console.log(e);
                    console.log(
                      'an error happened while trying to add a role to the team'
                    );
                  });
                }}
              >
                Add
              </Button>
            </div>
            {selectedTeam && (
              <div className="flex flex-wrap gap-1 items-center">
                {selectedTeam.roles.map((roleId, index) => {
                  const role = discordGuild?.roles.find((r) => r.id === roleId);
                  return (
                    <div
                      key={index}
                      className="px-2 py-1 rounded-lg bg-background flex items-center gap-2"
                    >
                      {role ? `@${role.name}` : roleId}
                      <Icons.close
                        size={24}
                        className="rounded-lg hover:bg-secondary p-1 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label className="text-gray-500">Members</Label>
            <div className="flex items-center gap-2">
              {isLoadingMembers || !members ? (
                <Skeleton className="w-[200px] h-8 bg-background" />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="min-h-10 min-w-[200px] flex items-center justify-between rounded-md border py-2 px-4 bg-background/80 cursor-pointer">
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
                      <CommandGroup className="max-h-[300px] overflow-y-auto w-full">
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
                                  currentValue
                              );
                              if (selectedValue) {
                                setSelectedMember(
                                  selectedMember &&
                                    selectedValue.user.id ===
                                      selectedMember.user.id
                                    ? null
                                    : selectedValue
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
                                'ml-auto h-4 w-4',
                                selectedMember &&
                                  selectedMember.user.id === mem.user.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
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
                size={'sm'}
                disabled={selectedMember === null}
                onClick={() => {
                  handleAddUser().catch((e) => {
                    console.log('error happened while adding user to the team');
                  });
                }}
              >
                Add
              </Button>
            </div>
            {selectedTeam && (
              <div className="flex flex-wrap gap-1 items-center">
                {selectedTeam.users.map((userId, index) => {
                  const mem = members?.find((m) => m.user.id === userId);
                  return (
                    <div key={index} className="p-1 rounded-lg">
                      {mem ? `@${mem.user.username}` : `<@${userId}>`}
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
