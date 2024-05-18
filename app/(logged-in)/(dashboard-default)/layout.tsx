import React from "react";
import TopNavBar, { type NavItemProps } from "../_components/top-navbar";
import DashboardHeader from "../_components/dashboard-header";
import { cn } from "@/lib/utils";
import { rubikFont } from "@/styles/fonts";
import UserInfoHeader from "../_components/user-info";

const navItems: NavItemProps[] = [
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

/**
 * Layout for /transcript and /servers pages
 * @param {React.ReactNode} children page content
 * @returns {React.ReactNode} layout component
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <>
      <DashboardHeader>
        <>
          <span
            className={cn(
              "text-foreground/20 font-bold text-xl hidden sm:block",
              rubikFont.className,
            )}
          >
            /
          </span>
          <UserInfoHeader className="block" />
        </>
      </DashboardHeader>
      <TopNavBar items={navItems} />
      <div className="py-4 min-h-screen">{children}</div>
    </>
  );
}
