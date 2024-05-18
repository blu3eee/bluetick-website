"use client";
import React, { useContext } from "react";
import useScrollPosition from "@react-hook/window-scroll";
import { useRange } from "@/hooks/use-range";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { BluetickContext } from "@/context/bluetick-context";
import { BLUETICK_BOT_ID } from "@/config/bluetick";
import { getBotInviteURL } from "@/lib/helper";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface NavItemProps {
  title: string;
  href: string;
  condition?: "startsWith" | "exact";
  disabled?: boolean;
}

interface TopNavBarProps {
  id?: string;
  items: NavItemProps[];
}

const TopNavBar: React.FC<TopNavBarProps> = ({ id, items }) => {
  const scrollY = useScrollPosition(60);
  const [y, setY] = React.useState(0);

  React.useEffect(() => {
    setY(scrollY);
  }, [scrollY]);

  const navX = useRange(y, 0, 50, 0, 42);
  const itemPaddingBottom = useRange(y, 0, 50, 10, 20);
  const itemPaddingTop = useRange(y, 0, 50, 0, 20);
  const pathname = usePathname();
  const router = useRouter();
  const { botDetails } = useContext(BluetickContext);

  const isDesktop = useMediaQuery("(min-width: 640px)");

  return (
    <nav className="sticky top-0 flex border-b bg-secondary text-sm items-center justify-between px-6 md:px-10 text-foreground/70 font-medium gap-4">
      <ol
        style={{
          transform: isDesktop ? `translateX(${navX}px)` : ``,
        }}
        className={cn(
          "relative flex gap-4 h-fit overflow-x-scroll no-scrollbar",
        )}
      >
        {items.map(({ title, href, condition, disabled }, index) => (
          <div
            key={index}
            onClick={() => {
              if (!disabled) {
                router.push(href);
              }
            }}
            className={cn(
              "h-full relative transition-all duration-300 ease-in-out cursor-pointer",
              disabled
                ? "text-foreground/30 cursor-not-allowed"
                : "hover:text-foreground/90",
              (condition && condition === "startsWith"
                ? pathname.startsWith(href)
                : pathname === href) && "text-foreground hover:text-foreground",
            )}
            style={{
              padding: `${itemPaddingTop}px 0px ${itemPaddingBottom}px 0px`,
            }}
          >
            {title}
            {(condition && condition === "startsWith"
              ? pathname.startsWith(href)
              : pathname === href) && (
              <motion.div
                layoutId={`nav-border-bar${id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute left-0 right-0 bottom-0 rounded-md bg-foreground h-[2px]"
              />
            )}
          </div>
        ))}
      </ol>

      {botDetails && (
        <a
          href={getBotInviteURL(botDetails.botID ?? BLUETICK_BOT_ID)}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "flex-none  h-full relative transition-all duration-300 ease-in-out hover:text-info cursor-pointer flex items-center gap-1 text-foreground",
          )}
          style={{
            padding: `${itemPaddingTop}px 0px ${itemPaddingBottom}px 0px`,
          }}
        >
          Invite bot <ExternalLink size={16} />
          <div className="absolute left-0 right-0 bottom-0 rounded-md bg-info h-[2px]" />
        </a>
      )}
    </nav>
  );
};

export default TopNavBar;
