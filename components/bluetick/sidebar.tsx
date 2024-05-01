"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import {
  getBotAvatarURL,
  getBotInviteURL,
  getUserAvatarURL,
} from "@/lib/helper";
import { LoginButton, LogoutButton } from "./auth-buttons";
import { useParams, usePathname } from "next/navigation";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  type LucideIcon,
  Package,
  Server,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { BluetickContext } from "@/context/bluetick-context";
import { BLUETICK_BOT_ID } from "@/config/bluetick";
import { Button } from "../ui/button";

export const SidebarContent = (): JSX.Element => {
  const { data: session, status } = useSession();
  const { botDetails, isLoading: isLoadingBluetick } =
    useContext(BluetickContext);

  const pathname = usePathname();
  const params = useParams<{ serverId: string }>();
  const [sidebarNavItems, setSidebarNavItems] = useState<
    Array<{
      href: string;
      icon: LucideIcon;
      label: string;
      show: boolean;
    }>
  >([]);

  useEffect(() => {
    const updatedSidebarNavItems = [
      {
        href: "servers",
        icon: Server,
        label: "Servers",
        show: true,
      },
      {
        href: `dashboard/${params?.serverId}`,
        icon: LayoutDashboard,
        label: "Dashboard",
        show: pathname.startsWith("/dashboard"),
      },
      {
        href: `dashboard/${params?.serverId}/modules`,
        icon: Package,
        label: "Modules",
        show: pathname.startsWith("/dashboard"),
      },
    ];

    setSidebarNavItems(updatedSidebarNavItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (status === "loading") {
    return (
      <div className="w-full flex flex-col gap-4 p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div>
        <LoginButton />
      </div>
    );
  }

  const { user: discordUser } = session;
  return (
    <div className="w-full flex flex-col gap-4 overflow-y-auto">
      {isLoadingBluetick ? (
        <Skeleton className="h-12 w-full" />
      ) : botDetails ? (
        <div className="flex gap-2 px-2 py-4 items-center">
          <Image
            width={50}
            height={50}
            src={getBotAvatarURL(botDetails)}
            alt="avatar"
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-bold">
              {botDetails.username}#{botDetails.discriminator}
            </span>
            <a href={getBotInviteURL(botDetails.botID ?? BLUETICK_BOT_ID)}>
              <span className="border rounded-lg mt-1 text-center hover:bg-gray-500/50 cursor-pointer w-fit px-4 py-1 font-semibold text-sm">
                Invite bot
              </span>
            </a>
          </div>
        </div>
      ) : null}
      {sidebarNavItems
        .filter((item) => item.show)
        .map((item) => (
          <Link
            key={item.href}
            href={`/${item.href}`}
            className={cn(
              "flex w-full items-center rounded-md p-2 hover:underline gap-4",
              {
                "bg-muted": pathname === `/${item.href}`,
              },
            )}
          >
            <item.icon />
            {item.label}
          </Link>
        ))}
      <Separator />
      <div className="flex flex-col gap-2">
        {discordUser && (
          <div className="px-2 py-4 rounded-lg flex flex-row border gap-2 items-center">
            <Image
              width={50}
              height={50}
              src={getUserAvatarURL(discordUser)}
              alt="avatar"
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-bold">
                {discordUser.global_name ?? discordUser.username}
              </span>
              <span className="text-sm text-blue-500">
                @{discordUser.username}
              </span>
            </div>
          </div>
        )}
        <LogoutButton />
      </div>
      {session.developerMode && (
        <a href="/dev">
          <Button className="w-full">Developer Mode</Button>
        </a>
      )}
    </div>
  );
};

export const SidebarWrapped = (): JSX.Element => {
  return (
    <aside className="top-14 z-30 h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-4 px-2 hidden fixed md:sticky md:block ">
      <SidebarContent />
    </aside>
  );
};
