"use client";

import React from "react";
import { MainNav } from "../nav/main";
import { LoginButton, LogoutButton } from "./auth-buttons";
import { bluetickConfig } from "@/config/bluetick";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { SidebarContent } from "./sidebar";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { getUserAvatarURL } from "@/lib/helper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const BluetickHeader = (): JSX.Element => {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <header className="z-40 bg-secondary px-8 md:px-12">
      <div className="flex h-20 items-center justify-between gap-6 py-6">
        <MainNav items={bluetickConfig.mainNav} config={bluetickConfig}>
          <SidebarContent />
        </MainNav>
        {status === "loading" ? (
          <Skeleton className="h-10 w-24 rounded-lg" />
        ) : session && session.user ? (
          <>
            <Popover>
              <PopoverTrigger>
                <Image
                  src={getUserAvatarURL(session.user)}
                  width={1024}
                  height={1024}
                  className="aspect-square h-[45px] w-auto rounded-full border-2 border-foreground/50 object-cover"
                  alt="user avt"
                />
              </PopoverTrigger>
              <PopoverContent align="end">
                <div className="flex flex-col gap-3">
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
              </PopoverContent>
            </Popover>
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
