'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { GuildContext } from '@/context/guild-context';
import type { UpdateGuildConfig } from '@/types/bluetick/db/guild-config';
import React, { useContext, useState } from 'react';
import { toast } from 'sonner';

const GuildConfig = (): JSX.Element => {
  const { config, isLoading, refetchGuildData, updateConfig } =
    useContext(GuildContext);
  const [prefix, setPrefix] = useState('');
  const [showSaveButton, setShowSaveButton] = useState(false);

  React.useEffect(() => {
    if (config) {
      setPrefix(config.prefix);
    }
  }, [config, refetchGuildData]);

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newPrefix = e.target.value;
    setPrefix(newPrefix);
    setShowSaveButton(newPrefix !== config?.prefix);
  };

  const saveGuildConfig = async (): Promise<void> => {
    try {
      const updateData: UpdateGuildConfig = {
        prefix,
      };

      updateConfig(updateData)
        .then((updated) => {
          if (updated) {
            toast('Bot config updated', {
              description: `Command prefix is set to \`${prefix}\``,
            });
            setShowSaveButton(false);
          } else {
            toast('Failed to update bot config');
          }
        })
        .catch(() => {});

      // Optionally, you can refetch the guild configuration after a successful update
    } catch (error) {
      console.error('Error updating guild config:', error);
    }
  };

  if (isLoading || !config) {
    return (
      <div className="w-full flex flex-col items-center h-36 gap-4">
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border px-6 py-4 bg-secondary w-full">
      <Label className="uppercase font-bold">Settings</Label>
      <div className="flex flex-col md:flex-row gap-2 items-start md:items:center w-full">
        <div className="w-full">
          <Label>Command Prefix</Label>
          <Input
            placeholder="bot command prefix"
            value={prefix}
            onChange={handlePrefixChange}
          />
          {showSaveButton && (
            <Button
              onClick={() => {
                saveGuildConfig().catch(() => {});
              }}
              className="mt-2"
            >
              Save
            </Button>
          )}
        </div>
        <div className="w-full">
          <Label>Locale</Label>
          <Input
            placeholder="bot command prefix"
            value={config.locale}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default GuildConfig;
