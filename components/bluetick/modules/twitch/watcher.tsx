import React from "react";
import type { TwitchUser } from "@/types/twitch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TwitchUserDisplay from "@/components/dev/twitch/user";

interface Props {
  user: TwitchUser | null;
  unwatch?: boolean;
  refetch?: () => void;
}

const TwitchWatcher: React.FC<Props> = ({ user, unwatch = false, refetch }) => {
  return (
    user && (
      <div className="flex flex-col gap-2 bg-secondary rounded-lg p-4 max-w-[520px]">
        <Label className="text-twitch uppercase font-semibold">Watching</Label>
        {unwatch && refetch && (
          <div className="flex flex-wrap items-center">
            <Button variant={"error"} size={"sm"}>
              Unwatch this user
            </Button>
          </div>
        )}
        <TwitchUserDisplay {...user} />
      </div>
    )
  );
};

export default TwitchWatcher;
