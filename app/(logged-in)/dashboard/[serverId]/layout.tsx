import { BLUETICK_BOT_ID } from "@/config/bluetick";
import { GuildContextProvider } from "@/context/guild-context";
import type { Metadata } from "next";
import React from "react";
import TopNavBar, { type NavItemProps } from "../../_components/top-navbar";
import DashboardHeader from "../../_components/dashboard-header";
import { cn } from "@/lib/utils";
import { rubikFont } from "@/styles/fonts";
import UserInfoHeader from "../../_components/user-info";
import ServerSelectComboBox from "./_components/server-combobox";

interface GuildLayoutProps {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Bluetick - All in one discord bot",
};

/**
 * GuildLayout provides a context wrapper for the guild dashboard.
 * It uses the GuildContextProvider to pass down the server ID and bot ID to child components.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout.
 * @param {object} props.params - Parameters passed to the component, containing a `serverId`.
 * @returns {JSX.Element} The GuildLayout component wrapped with the GuildContextProvider.
 */
export default function GuildLayout({
  children,
  params,
}: GuildLayoutProps): JSX.Element {
  const { serverId } = params;
  const botId = BLUETICK_BOT_ID;

  const navItems: NavItemProps[] = [
    {
      title: "Dashboard",
      href: `/dashboard/${serverId}`,
    },
    {
      title: "Modules",
      href: `/dashboard/${serverId}/modules`,
      condition: "startsWith",
    },
    {
      title: "Servers",
      href: "/servers",
    },
    {
      title: "Transcripts",
      href: "/transcripts",
      disabled: true,
    },
  ];

  return (
    <GuildContextProvider serverId={serverId} botId={botId}>
      <DashboardHeader>
        <>
          <span
            className={cn(
              "hidden text-xl font-bold text-foreground/20 sm:block",
              rubikFont.className,
            )}
          >
            /
          </span>
          <UserInfoHeader />
          <span
            className={cn(
              "text-xl font-bold text-foreground/20",
              rubikFont.className,
            )}
          >
            /
          </span>
          <ServerSelectComboBox serverId={serverId} />
        </>
      </DashboardHeader>
      <TopNavBar items={navItems} id={serverId} />
      <div className="container min-h-screen py-6">{children}</div>
    </GuildContextProvider>
  );
}
