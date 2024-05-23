"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { BadgeDisplay } from "@/components/bluetick/ui/badge";
import { Callout } from "@/components/callout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserAvatarURL } from "@/lib/helper";
import useUserFlags from "@/lib/user-flags";
import { rubikFont } from "@/styles/fonts";
import { Copy } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const UserInfoComponent = (): React.ReactNode => {
  const { data: session, status } = useSession();

  const { convertUserFlags } = useUserFlags();
  const [userBadges, setUserBadges] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (session?.user?.flags) {
      setUserBadges(convertUserFlags(session.user.flags));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex h-fit w-full items-center justify-center">
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Callout>Invalid Request</Callout>
      </div>
    );
  }

  const { user: discordUser } = session;
  const copyToClipboard = (): void => {
    navigator.clipboard
      .writeText(discordUser.id)
      .then(() => {
        // Handle successful copy action (e.g., show a toast notification)
        console.log("ID copied to clipboard!");
      })
      .catch((err) => {
        // Handle errors (e.g., clipboard permissions denied)
        console.error("Failed to copy ID:", err);
      });
  };

  return (
    <div className="flex w-full items-center gap-4 rounded-lg border px-4 py-4 md:px-12">
      <Image
        className="border-spacing-0 rounded-full object-cover"
        src={
          discordUser.avatar
            ? getUserAvatarURL(discordUser)
            : "/discord/discord.png"
        }
        alt="user avatar"
        height={75}
        width={75}
      />
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <div className="flex w-full flex-col">
            <div className={`text-2xl font-bold ${rubikFont.className}`}>
              {discordUser.global_name ?? discordUser.username}
            </div>
            <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-bold text-blue-500">
              @{discordUser.username}
              <Button
                variant="link"
                className="gap-2 text-xs text-red-400 hover:text-red-400/70"
                size={"sm"}
                onClick={() => {
                  copyToClipboard();
                  toast.info("Copied your user ID");
                }}
              >
                <Copy size={16} />
                Copy ID
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {userBadges.map((badge) => (
            <BadgeDisplay key={badge} badge={badge} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserInfoComponent;
