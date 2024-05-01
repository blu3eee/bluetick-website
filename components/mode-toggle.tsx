import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";

// Adjust ModeMenuItem to accept icon as a React element
interface ModeMenuItemProps {
  mode: string;
  icon: React.ReactNode; // Use React.ReactNode for the icon prop
}

const ModeMenuItem: React.FC<ModeMenuItemProps> = ({ mode, icon }) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuItem
      className={`flex items-center focus:bg-accent/60 ${theme === mode ? "bg-secondary/80 focus:bg-accent:50" : ""}`}
      onClick={() => {
        setTheme(mode);
      }}
    >
      <div className="mr-2 h-4 w-4">
        {icon} {/* Render the icon directly */}
      </div>
      <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
    </DropdownMenuItem>
  );
};

/**
 * ModeToggle component allows users to switch between light, dark, and system themes.
 * @returns {JSX.Element} The ModeToggle component with a dropdown menu for theme selection.
 */
export function ModeToggle(): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-8 px-0 hover:bg-primary/50"
        >
          <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        {/* Pass the icon component for each mode */}
        <ModeMenuItem mode="light" icon={<Icons.sun className="h-4 w-4" />} />
        <ModeMenuItem mode="dark" icon={<Icons.moon className="h-4 w-4" />} />
        <ModeMenuItem
          mode="system"
          icon={<Icons.laptop className="h-4 w-4" />}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
