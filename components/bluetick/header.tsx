"use client";

import React, { useEffect } from "react";
import { MainNav } from "../nav/main";
import { LoginButton, LogoutButton } from "./auth-buttons";
import { bluetickConfig } from "@/config/bluetick";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { SidebarContent } from "./sidebar";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";

const BluetickHeader = (): JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      status !== "loading" &&
      !session &&
      pathname &&
      (pathname.startsWith("/dashboard") || pathname.startsWith("/servers"))
    ) {
      router.push("/");
    }
  }, [session, status, pathname, router]);

  return (
    <header className="z-40 bg-secondary px-8 md:px-12">
      <div className="flex h-20 items-center justify-between py-6 gap-6">
        <MainNav items={bluetickConfig.mainNav} config={bluetickConfig}>
          <SidebarContent />
        </MainNav>
        {status === "loading" ? (
          <Skeleton className="rounded-lg w-24 h-10" />
        ) : session ? (
          <>
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant={"outline"}
                onClick={() => {
                  router.push("/servers");
                }}
              >
                Manage Servers
              </Button>
              <LogoutButton className="hidden md:block" />
            </div>
          </>
        ) : (
          <>
            <LoginButton className="hidden md:block" />
            <LoginButton className="block md:hidden">Login</LoginButton>
          </>
        )}
      </div>
    </header>
  );
};

export default BluetickHeader;
