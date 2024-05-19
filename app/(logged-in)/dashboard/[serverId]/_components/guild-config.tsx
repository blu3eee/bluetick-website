"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { GuildContext } from "@/context/guild-context";
import type { UpdateGuildConfig } from "@/types/bluetick/db/guild-config";
import React, { useContext, useState } from "react";
import { toast } from "sonner";
import ISO6391 from "iso-639-1";
import { Icons } from "@/components/icons";

const availableLocales = ["en", "vi"];
const GuildConfig = (): JSX.Element => {
  const { config, isLoading, refetchGuildData, updateConfig } =
    useContext(GuildContext);
  const [prefix, setPrefix] = useState("");
  const [locale, setLocale] = useState("en");
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
          toast.success("Bot locale and language updated", {
            description: `Locale is set to \`${ISO6391.getName(locale)}\``,
          });
          setShowSaveButton(false);
        } else {
          toast.error("Failed to update bot locale");
        }
      })
      .catch(() => {
        toast.error("Failed to update bot locale");
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
            toast("Bot config updated", {
              description: `Command prefix is set to \`${prefix}\``,
            });
            setShowSaveButton(false);
          } else {
            toast("Failed to update bot config");
          }
        })
        .catch(() => {});

      // Optionally, you can refetch the guild configuration after a successful update
    } catch (error) {
      console.error("Error updating guild config:", error);
    }
  };

  if (isLoading || !config) {
    return (
      <div className="flex h-36 w-full flex-col items-center gap-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border bg-secondary px-6 py-4">
      <Label className="font-bold uppercase">Settings</Label>
      <div className="md:items:center flex w-full flex-col items-start gap-2 md:flex-row">
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
        <div className="flex w-full flex-col gap-1">
          <Label>Locale</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"outline"}
                size="sm"
                className="relative mt-1 flex h-10 w-fit items-center justify-between gap-4 p-4 text-start hover:bg-primary/50"
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
