'use client';
import React, { useContext, useState } from 'react';
import type { ServerIdProps } from '../props';
import { Label } from '@/components/ui/label';
import { GuildContext } from '@/context/guild-context';
import { Skeleton } from '@/components/ui/skeleton';
import RoleSelect from '../../ui/role-select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { BLUETICK_BOT_ID, ROUTES, apiInstance } from '@/config/bluetick';
import type {
  AutoRoleDetails,
  CreateAutoRoleDto,
} from '@/types/bluetick/db/autorole';
import { useFetchGuildAutoRoles } from '@/hooks/api/autorole/list';

const AutoRolesComponent: React.FC<ServerIdProps> = ({ serverId }) => {
  const { discordGuild, isLoading } = useContext(GuildContext);

  const [selectedRole, setSelectedRole] = React.useState('');
  const [delay, setDelay] = useState('0'); // State to keep track of delay input
  const [roleActionType, setRoleActionType] = useState('add'); // State to keep track of role action type

  const {
    data: autoRoles,
    status,
    refetch,
  } = useFetchGuildAutoRoles(BLUETICK_BOT_ID, serverId);

  const handleAddAutoRole = async (): Promise<void> => {
    try {
      const createDto: CreateAutoRoleDto = {
        botID: BLUETICK_BOT_ID,
        guildID: serverId,
        type: roleActionType,
        roleID: selectedRole,
        delay: Number(delay),
      };
      const { data } = await apiInstance.post<{ data: AutoRoleDetails }>(
        `${ROUTES.AUTO_ROLES}`,
        createDto
      );

      if (data.data) {
        toast.success(`Auto-role created`);
        await refetch();
      } else {
        toast.success(`Failed to create auto-role`);
      }
    } catch (e) {
      toast.error('An error happened while trying to add auto-role');
    }
  };

  const handleDeleteAutoRole = async (id: number): Promise<void> => {
    try {
      const { data } = await apiInstance.delete<{ data: { message: string } }>(
        `${ROUTES.AUTO_ROLES}/${id}`
      );

      if (data.data.message) {
        toast.success(`Auto-role deleted`);
        await refetch();
      } else {
        toast.error(`Failed to delete auto-role`);
      }
    } catch (e) {
      toast.error('An error happened while trying to delete an auto-role');
    }
  };

  const areInputsValid = (): boolean => {
    // Check if selectedRole is not '0'
    const isValidRoleSelected =
      selectedRole !== '' &&
      discordGuild?.roles.find((role) => role.id === selectedRole) !== null;

    // Check if delay is a non-negative number. Since delay is a string, convert it to a number first.
    // Also, ensure that the delay is not empty.
    const isValidDelay =
      delay !== '' && !isNaN(Number(delay)) && Number(delay) >= 0;

    return isValidRoleSelected && isValidDelay;
  };

  const getRoleNameById = (id: string): string => {
    if (!discordGuild) return 'Unknown';
    const role = discordGuild.roles.find((role) => role.id === id);
    return role?.name ?? 'Unknown';
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="bg-secondary rounded-lg p-4 flex flex-col gap-4 w-full md:w-1/2">
        <Label className="uppercase">Add/Remove role</Label>
        <span className="text-xs text-foreground/60">
          Autoroles will be given (or removed) to members when joining the
          server immediately, or after a period of time.
        </span>
        <div className="flex flex-col gap-2">
          <Label className="uppercase text-foreground/50">Select Role</Label>
          {isLoading ? (
            <Skeleton className="w-full h-10" />
          ) : discordGuild ? (
            <RoleSelect
              roles={discordGuild?.roles}
              value={selectedRole}
              onValueChange={setSelectedRole}
              allowEveryone={false}
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="uppercase text-foreground/50">
            Delay (minutes)
          </Label>
          <Input
            className="mt-1 block w-full"
            type="number"
            min={0}
            placeholder="Enter delay in minutes"
            value={delay}
            onChange={(e) => {
              // Check if the value is not negative; if negative, set it to an empty string or a desired minimum
              const newValue = e.target.value;
              if (newValue !== '' && Number(newValue) < 0) {
                setDelay('0'); // Resets to 0 if a negative number is attempted
              } else {
                setDelay(newValue);
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="uppercase text-foreground/50">Type</Label>
          <RadioGroup
            onValueChange={setRoleActionType}
            value={roleActionType}
            className="flex flex-wrap gap-4 ml-2"
          >
            <div className="flex items-center gap-2 text-foreground/60">
              <RadioGroupItem value="add" />
              <span className="text-sm">Add Role</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/60">
              <RadioGroupItem value="remove" />
              <span className="text-sm font-normal">Remove Role</span>
            </div>
          </RadioGroup>
        </div>
        <Button
          variant={'blue'}
          onClick={() => {
            handleAddAutoRole().catch((e) => {});
          }}
          disabled={!areInputsValid()}
        >
          Add
        </Button>
      </div>
      <div className="bg-secondary rounded-lg p-4 flex flex-col gap-4 w-full md:w-1/2">
        <Label className="uppercase">Autorole List</Label>
        {status !== 'success' ? (
          <Skeleton className="w-full h-10" />
        ) : (
          <div className="w-full">
            <Table>
              <TableCaption>
                {autoRoles.length === 0
                  ? 'No auto-role found'
                  : 'A list of your auto-role.'}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Delay (Minutes)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {autoRoles.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{getRoleNameById(row.roleID)}</TableCell>
                    <TableCell>{row.delay}</TableCell>
                    <TableCell className="flex justify-end items-center gap-2">
                      <div
                        className="text-white px-2 py-1 rounded-md font-semibold bg-destructive cursor-pointer"
                        onClick={() => {
                          handleDeleteAutoRole(row.id).catch((e) => {
                            console.log(e);
                          });
                        }}
                      >
                        Delete
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoRolesComponent;
