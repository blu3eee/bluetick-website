"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GuildContext } from "@/context/guild-context";
import { cn } from "@/lib/utils";
import { rubikFont } from "@/styles/fonts";
import { LayoutPanelLeft } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext } from "react";
import { toast } from "sonner";

interface TemplateProps {
  flag: number;
  label: string;
  children: React.ReactNode;
}

const ModulePageTemplate: React.FC<TemplateProps> = ({
  flag,
  label,
  children,
}) => {
  const params = useParams<{ serverId: string }>();
  const { config, isLoading, updateConfig } = useContext(GuildContext);

  if (!params) {
    return null;
  }

  if (!config || isLoading) {
    return null;
  }
  const isModuleEnabled = (): boolean => (config.moduleFlags & flag) !== 0;

  const handleToggleModule = async (): Promise<void> => {
    const wasTrue = isModuleEnabled();
    const newFlags =
      config.moduleFlags & flag
        ? config.moduleFlags & ~flag
        : config.moduleFlags | flag;
    const success = await updateConfig({ moduleFlags: newFlags });
    if (success) {
      // Optionally, show feedback to the user
      toast.success(`${label} module is ${wasTrue ? `off` : "on"}.`);
    } else {
      // Handle error
      toast.error(`Failed to toggle module \`${label}\`.`);
    }
  };

  return (
    <div>
      <div className="my-2 flex w-full max-w-[1024px] flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div
          className={cn(
            "flex items-center gap-2 text-2xl font-bold ",
            rubikFont.className,
          )}
        >
          <a
            className="flex cursor-pointer items-center gap-2 text-red-400 hover:text-red-400/80 "
            href={`/dashboard/${params.serverId}/modules`}
          >
            <LayoutPanelLeft />
            Modules
          </a>
          <span>/ {label}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isModuleEnabled()}
            id="module-toggle"
            onClick={() => {
              handleToggleModule().catch((e) => {
                console.error(e);
              });
            }}
          />
          <Label htmlFor="module-toggle">
            Module {isModuleEnabled() ? "Enabled" : "Disabled"}
          </Label>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ModulePageTemplate;
