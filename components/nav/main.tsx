"use client";

import * as React from "react";
import Link from "next/link";

import type { NavMenu, MainNavItem, NavItem, SiteConfig } from "@/types";

import { Icons } from "@/components/icons";
import { MobileNav } from "@/components/nav/mobile";
import { rubikFont } from "@/styles/fonts";
import { Menu } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { bluetickConfig } from "@/config/bluetick";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
  config?: SiteConfig;
}

/**
 * Renders the main navigation menu.
 *
 * This component is designed to display the main navigation links across the top of the
 * application. It dynamically renders navigation items based on the `items` prop. This
 * component is typically visible on wider screens and hidden on mobile, where `MobileNav`
 * would be used instead.
 * @param {MainNavProps} props - The props for the MainNav component.
 * @param {MainNavItem[]} [props.items] - Array of main navigation items to display.
 * @param {React.ReactNode} [props.children] - Optional children to render additionally within the navigation.
 * @param {SiteConfig | BluetickConfig | EuterpefyConfig} [props.config] - Optional children to render additionally within the navigation.
 * @returns {JSX.Element} The MainNav component for desktop viewports.
 */
export function MainNav({
  items,
  children,
  config,
}: MainNavProps): JSX.Element {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  // Function to toggle mobile menu visibility
  const toggleMobileMenu = (): void => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Function to close the mobile menu
  const closeMobileMenu = (): void => {
    setShowMobileMenu(false);
  };

  const [activeItem, setActiveItem] = React.useState<NavItem | null>(null);

  return (
    <>
      <div className="flex gap-2 items-center md:hidden">
        <Button
          variant={"ghost"}
          className="relative h-9 w-8 px-0 hover:bg-primary/50"
          onClick={toggleMobileMenu}
        >
          {showMobileMenu ? <Icons.close /> : <Menu />}
        </Button>
        <div className="block">
          <ModeToggle />
        </div>
      </div>
      {showMobileMenu && items && (
        <MobileNav
          items={items}
          isOpen={showMobileMenu}
          onClose={closeMobileMenu}
        >
          {children}
        </MobileNav>
      )}
      <div className="flex gap-6 md:gap-10 justify-between items-center w-fit md:w-full">
        <div className="flex gap-6 items-center">
          <Link
            className="flex items-center"
            href={config ? config.href : bluetickConfig.href}
          >
            <Icons.logo size={32} />
            <span
              className={`ml-6 font-bold text-2xl uppercase tracking-widest hidden md:block ${rubikFont.className}`}
            >
              {config ? config.name : bluetickConfig.name}
            </span>
          </Link>

          {items?.length ? (
            <NavigationMenu className="hidden md:flex w-full">
              <NavigationMenuList>
                {items.map((item, index) => {
                  if (isNavMenu(item)) {
                    return (
                      <NavMenuListItem
                        key={index}
                        item={item}
                        index={index}
                        activeItem={activeItem}
                        setActiveItem={setActiveItem}
                      />
                    );
                  } else {
                    return (
                      <NavigationMenuItem key={index}>
                        <Link href={item.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                          >
                            {item.title}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    );
                  }
                })}
              </NavigationMenuList>
            </NavigationMenu>
          ) : null}
        </div>

        <div className="hidden md:block">
          <ModeToggle />
        </div>
      </div>
    </>
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { className?: string; title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const NavMenuListItem: React.FC<{
  item: NavMenu;
  index: number;
  activeItem: NavItem | null;
  setActiveItem: (newValue: NavItem | null) => void;
}> = ({ item, index, activeItem, setActiveItem }): JSX.Element => {
  return (
    <NavigationMenuItem key={index}>
      <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
          {item.description && (
            // item description block
            <li className="row-span-3">
              <NavigationMenuLink asChild>
                <a
                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href={item.description.href}
                >
                  {activeItem ? (
                    <>
                      {activeItem.image && (
                        <Image
                          src={activeItem.image}
                          alt={activeItem.title}
                          width={150}
                          height={150}
                          className="w-full h-auto rounded-md"
                        />
                      )}
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Project:{" "}
                        <span className="font-bold">{activeItem.title}</span>
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        {activeItem.description}
                      </p>
                    </>
                  ) : (
                    <>
                      <Icons.logo className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        {item.title}
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        {item.description.content}
                      </p>
                    </>
                  )}
                </a>
              </NavigationMenuLink>
            </li>
          )}
          {item.items.map((component) => (
            <ListItem
              key={component.title}
              title={component.title}
              href={component.href}
              onMouseEnter={() => {
                setActiveItem(component);
              }}
              onMouseLeave={() => {
                setActiveItem(null);
              }}
            >
              {component.description}
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
