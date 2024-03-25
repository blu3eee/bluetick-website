import { Icons } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { GuildContext } from '@/context/guild-context';
import React, { useContext } from 'react';
import { toast } from 'sonner';

export interface ModuleCardProps {
  name: string;
  description: string;
  navigateTo: string;
  flag: number;
}

export const ModuleCard: React.FC<ModuleCardProps> = (props) => {
  const { config, isLoading, updateConfig } = useContext(GuildContext);

  if (isLoading || !config)
    return <Skeleton className="w-60 h-36 rounded-lg" />;

  const isModuleEnabled = (): boolean =>
    (config.moduleFlags & props.flag) !== 0;

  const handleToggleModule = async (): Promise<void> => {
    const wasTrue = isModuleEnabled();
    const newFlags =
      config.moduleFlags & props.flag
        ? config.moduleFlags & ~props.flag
        : config.moduleFlags | props.flag;
    const success = await updateConfig({ moduleFlags: newFlags });
    if (success) {
      // Optionally, show feedback to the user
      toast.success(`${props.name} module is ${wasTrue ? `off` : 'on'}.`);
    } else {
      // Handle error
      toast.error(`Failed to toggle module ${props.name}.`);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-secondary p-4 rounded-lg justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col justify-between gap-2">
          <div className="text-lg font-semibold">{props.name}</div>
          <Switch
            size="xs"
            checked={isModuleEnabled()}
            id="disable-module"
            onClick={() => {
              handleToggleModule().catch((e) => {
                console.log(e);
              });
            }}
            className="self-end"
          />
        </div>
        <div className="text-gray-500 text-sm">{props.description}</div>
      </div>
      <div className="flex items-center gap-1 justify-end">
        <a
          href={`https://docs.bluetick.khainguyen.dev/en/dashboard/${props.navigateTo}`}
          className="bg-warning text-warning-foreground hover:bg-warning-light focus:bg-warning-light/80 px-2 py-1 w-fit rounded-lg border text-sm self-end flex gap-1 items-center font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icons.help size={16} />
          Help
        </a>
        <a
          href={`/dashboard/${config.guild.guildID}/modules/${props.navigateTo}`}
          className="bg-info text-info-foreground hover:bg-info-light focus:bg-info-light/80 px-2 py-1 w-fit rounded-lg border text-sm self-end flex items-center gap-1 font-medium"
        >
          <Icons.settings size={16} />
          Settings
        </a>
      </div>
    </div>
  );
};

export enum GuildModules {
  WELCOME = 2,
  AUTO_RESPONSE = 4,
  TICKET = 8,
  BOOKING = 16,
  GIVEAWAYS = 32,
  AUTO_MESSAGE = 64,
  TWITCH = 128,
  YOUTUBE = 256,
  MESSAGE_EMBEDDER = 512,
  AUTOROLES = 1 << 10,
  ACTION_LOGS = 1 << 11,
}

export const guildModules: ModuleCardProps[] = [
  {
    name: 'Welcome',
    description: 'Create welcome messages with various options.',
    navigateTo: 'welcome',
    flag: GuildModules.WELCOME,
  },
  {
    name: 'Autoresponder',
    description: 'Automatically respond to text triggers.',
    navigateTo: 'auto-responder',
    flag: GuildModules.AUTO_RESPONSE,
  },
  {
    name: 'Ticket System',
    description:
      'System to create dedicated channels or threads tailored to serve various purposes based on your needs',
    navigateTo: 'ticket-system',
    flag: GuildModules.TICKET,
  },
  // {
  //   name: 'Twitch',
  //   description:
  //     'System to creatededicated channels or threads tailored to serve various purposes based on your needs',
  //   navigateTo: 'twitch',
  //   flag: GuildModules.TWITCH,
  // },
  {
    name: 'Autoroles',
    description:
      'Enables auto roles on join, timed auto roles, and joinable ranks.',
    navigateTo: 'auto-roles',
    flag: GuildModules.AUTOROLES,
  },
  {
    name: 'Action Logs',
    description: 'Customizable log of events that happen in the server.',
    navigateTo: 'action-logs',
    flag: GuildModules.ACTION_LOGS,
  },
];
