'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { GuildContext } from '@/context/guild-context';
import type { UpdateGuildConfig } from '@/types/bluetick/db/guild-config';
import React, { useContext, useState } from 'react';
import { toast } from 'sonner';
import ISO6391 from 'iso-639-1';
import { Icons } from '@/components/icons';

const availableLocales = ['en', 'vi'];
const GuildConfig = (): JSX.Element => {
  const { config, isLoading, refetchGuildData, updateConfig } =
    useContext(GuildContext);
  const [prefix, setPrefix] = useState('');
  const [locale, setLocale] = useState('en');
  const [showSaveButton, setShowSaveButton] = useState(false);

  React.useEffect(() => {
    if (config) {
      setPrefix(config.prefix);
      setLocale(config.locale);
    }
  }, [config, refetchGuildData]);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newPrefix = e.target.value;
    setPrefix(newPrefix);
    setShowSaveButton(newPrefix !== config?.prefix || locale !== config.locale);
  };

  const handleLocaleChange = (locale: string): void => {
    updateConfig({ locale })
      .then((updated) => {
        if (updated) {
          toast.success('Bot locale and language updated', {
            description: `Locale is set to \`${ISO6391.getName(locale)}\``,
          });
          setShowSaveButton(false);
        } else {
          toast.error('Failed to update bot locale');
        }
      })
      .catch(() => {
        toast.error('Failed to update bot locale');
      });
  };

  const handleSavePrefix = async (): Promise<void> => {
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
            onChange={handleConfigChange}
          />
          {showSaveButton && (
            <Button
              onClick={() => {
                handleSavePrefix().catch(() => {});
              }}
              className="mt-2"
            >
              Save
            </Button>
          )}
        </div>
        <div className="w-full flex flex-col gap-1">
          <Label>Locale</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'outline'}
                size="sm"
                className="relative h-10 mt-1 p-4 hover:bg-primary/50 w-full text-start flex items-center justify-between w-fit gap-4"
              >
                {ISO6391.getNativeName(locale)}
                <Icons.select size={16} />
                <span className="sr-only">Language selector</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              {availableLocales.map((l, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    handleLocaleChange(l);
                  }}
                >
                  {ISO6391.getNativeName(l)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default GuildConfig;
