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
    <nav className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b bg-secondary px-6 text-sm font-medium text-foreground/70 md:px-10">
      <ol
        style={{
          transform: isDesktop ? `translateX(${navX}px)` : ``,
        }}
        className={cn(
          "no-scrollbar relative flex h-fit gap-4 overflow-x-scroll",
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
              "relative h-full cursor-pointer transition-all duration-300 ease-in-out",
              disabled
                ? "cursor-not-allowed text-foreground/30"
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
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-md bg-foreground"
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
            "relative  flex h-full flex-none cursor-pointer items-center gap-1 text-foreground transition-all duration-300 ease-in-out hover:text-info",
          )}
          style={{
            padding: `${itemPaddingTop}px 0px ${itemPaddingBottom}px 0px`,
          }}
        >
          Invite bot <ExternalLink size={16} />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-md bg-info" />
        </a>
      )}
    </nav>
  );
};

export default TopNavBar;
