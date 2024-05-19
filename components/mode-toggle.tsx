import * as React from "react";
import { useTheme } from "next-themes";

import { buttonVariants } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";

// Adjust ModeMenuItem to accept icon as a React element
interface ModeMenuItemProps {
  mode: string;
  icon: React.ReactNode; // Use React.ReactNode for the icon prop
}

const ModeMenuItem: React.FC<ModeMenuItemProps> = ({ mode, icon }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        `flex w-full cursor-pointer items-center rounded-md px-2 py-1 transition-all duration-300 ease-in-out hover:bg-primary/15`,
        theme === mode && "bg-primary/10",
      )}
      onClick={() => {
        setTheme(mode);
      }}
    >
      <PopoverClose className="flex items-center gap-2">
        <div className="mr-2 h-4 w-4">
          {icon} {/* Render the icon directly */}
        </div>
        <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
      </PopoverClose>
    </div>
  );
};

/**
 * ModeToggle component allows users to switch between light, dark, and system themes.
 * @returns {JSX.Element} The ModeToggle component with a dropdown menu for theme selection.
 */
export function ModeToggle(): JSX.Element {
  return (
    <Popover>
      <PopoverTrigger>
        <div
          // variant="ghost"
          // size="sm"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "relative h-9 w-8 px-0",
          )}
        >
          <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-full min-w-[150px] ">
        <div className="flex w-full flex-col gap-1">
          <ModeMenuItem mode="light" icon={<Icons.sun className="h-4 w-4" />} />
          <ModeMenuItem mode="dark" icon={<Icons.moon className="h-4 w-4" />} />
          <ModeMenuItem
            mode="system"
            icon={<Icons.laptop className="h-4 w-4" />}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
