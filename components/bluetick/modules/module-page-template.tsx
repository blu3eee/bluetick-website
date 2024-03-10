'use client';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { GuildContext } from '@/context/guild-context';
import { cn } from '@/lib/utils';
import { rubikFont } from '@/styles/fonts';
import { LayoutPanelLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useContext } from 'react';
import { toast } from 'sonner';

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
      toast.success(`${label} module is ${wasTrue ? `off` : 'on'}.`);
    } else {
      // Handle error
      toast.error(`Failed to toggle module \`${label}\`.`);
    }
  };

  return (
    <div>
      <div className="flex items-start md:items-center justify-between w-full max-w-[1024px] my-2 flex-col md:flex-row gap-2">
        <div
          className={cn(
            'flex items-center text-2xl font-bold gap-2 ',
            rubikFont.className
          )}
        >
          <a
            className="flex gap-2 items-center text-red-400 hover:text-red-400/80 cursor-pointer "
            href={`/bluetick/dashboard/${params.serverId}/modules`}
          >
            <LayoutPanelLeft />
            Modules
          </a>
          <span>/ {label}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isModuleEnabled()}
            id="disable-module"
            onClick={() => {
              handleToggleModule().catch((e) => {
                console.error(e);
              });
            }}
          />
          <Label htmlFor="disable-module">Module disabled</Label>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ModulePageTemplate;
