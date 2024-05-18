"use client";
import { Icons } from "@/components/icons";

import React from "react";

import { ExternalLink, Settings } from "lucide-react";
import useScrollPosition from "@react-hook/window-scroll";
import { useRange } from "@/hooks/use-range";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { rubikFont } from "@/styles/fonts";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";

interface DashboardHeaderProps {
  children: React.ReactNode;
}
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  children,
}): React.ReactNode => {
  const scrollY = useScrollPosition(60);
  const [y, setY] = React.useState(0);

  React.useEffect(() => {
    setY(scrollY);
  }, [scrollY]);

  const logoScale = useRange(y, 0, 50, 1, 0.8);

  return (
    <>
      <header className="flex gap-4 bg-secondary px-6 py-4 sm:pl-[70px] text-sm transition-all duration-1000">
        <Icons.logo
          size={36}
          style={{
            transform: `scale(${logoScale})`,
          }}
          className="fixed left-6 top-3 z-10 hidden sm:block"
          aria-label="Vercel Logo"
        />
        <InfoBar>{children}</InfoBar>
      </header>
    </>
  );
};

export default DashboardHeader;

interface InfoBarProps {
  children: React.ReactNode;
}

const InfoBar: React.FC<InfoBarProps> = ({ children }): React.ReactNode => {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex gap-2 items-center">{children}</div>
      <div className="flex items-center gap-1 text-foreground/70 font-medium">
        <ModeToggle />
        <div className="flex md:hidden items-center gap-2">
          <Popover>
            <PopoverTrigger>
              <div
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-9 w-8 px-0 cursor-pointer",
                )}
              >
                <Settings />
              </div>
            </PopoverTrigger>
            <PopoverContent align="end">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-info">
                  <Icons.logo size={30} aria-label="Vercel Logo" />
                  <span
                    className={cn(
                      "text-xl font-bold uppercase tracking-wide",
                      rubikFont.className,
                    )}
                  >
                    Bluetick
                  </span>
                </div>
                <NavLinks />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <NavLinks />
        </div>
      </div>
    </div>
  );
};

const NavLinks = (): React.ReactNode => {
  return (
    <>
      <a
        href="https://docs.bluetick.khainguyen.dev/en"
        target="_blank"
        rel="noreferrer"
        className="hover:text-foreground flex items-center gap-1 transition-all duration-300 ease-in-out"
      >
        Docs
        <ExternalLink size={16} />
      </a>
    </>
  );
};
