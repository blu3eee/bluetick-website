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
              "hidden text-xl font-bold text-foreground/20 sm:block",
              rubikFont.className,
            )}
          >
            /
          </span>
          <UserInfoHeader className="block" />
        </>
      </DashboardHeader>
      <TopNavBar items={navItems} />
      <div className="min-h-screen py-4">{children}</div>
    </>
  );
}
