import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useLockBody } from "@/hooks/use-lock-body";
import { Icons } from "@/components/icons";
import type { MainNavItem, NavMenu } from "@/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDown } from "lucide-react";
import { bluetickConfig } from "@/config/bluetick";

interface MobileNavProps {
  items: MainNavItem[];
  children?: React.ReactNode;
  isOpen: boolean; // Added to represent the open state
  onClose: () => void;
}

/**
 * Renders a mobile navigation menu that is toggleable via the `isOpen` prop.
 *
 * The navigation presents the site's logo and a list of navigation items. It uses the `useLockBody`
 * hook to prevent body scroll when open. The `onClose` callback is invoked to close the menu.
 * @param {MobileNavProps} props - The props for the MobileNav component.
 * @returns {JSX.Element} - The MobileNav component.
 */
export function MobileNav({
  items,
  children,
  isOpen,
  onClose,
}: MobileNavProps): JSX.Element {
  useLockBody(isOpen); // Pass the `isOpen` state to the hook

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden backdrop-blur-lg",
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md ">
        <Link
          href={"/"}
          onClick={onClose}
          className="flex items-center space-x-2 text-xl"
        >
          <Icons.logo />
          <span className="font-bold">{bluetickConfig.name}</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => {
            if (isNavMenu(item)) {
              return (
                <Collapsible key={index}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-foreground">
                    {item.title} <ChevronDown />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.items.map((navItem, innerIndex) => {
                      return (
                        <Link
                          key={innerIndex}
                          onClick={onClose}
                          href={navItem.disabled ? "#" : navItem.href}
                          className={cn(
                            "flex w-full items-center rounded-md py-2 px-6 text-sm font-medium hover:underline",
                            navItem.disabled && "cursor-not-allowed opacity-60",
                          )}
                        >
                          {navItem.title}
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            } else {
              return (
                <Link
                  key={index}
                  onClick={onClose}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex w-full items-center rounded-md py-2 text-sm font-medium hover:underline",
                    item.disabled && "cursor-not-allowed opacity-60",
                  )}
                >
                  {item.title}
                </Link>
              );
            }
          })}
        </nav>
        <div onClick={onClose}>{children}</div>
      </div>
    </div>
  );
}

/**
 * Type guard to determine if a navigation item is a NavMenu.
 * @param {MainNavItem} item - The navigation item to check.
 * @returns {boolean} - `true` if the item is a NavMenu, otherwise `false`.
 */
function isNavMenu(item: MainNavItem): item is NavMenu {
  return (item as NavMenu).items !== undefined;
}
