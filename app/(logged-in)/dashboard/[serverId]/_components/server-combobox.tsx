"use client";
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMutualGuildsContext } from "@/app/(logged-in)/_context/mutual-guilds";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCurrentGuildContext } from "@/context/guild-context";
import Image from "next/image";
import { getGuildIconURL } from "@/lib/helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
interface Props {
  serverId: string;
}
const ServerSelectComboBox: React.FC<Props> = ({ serverId }) => {
  const [open, setOpen] = React.useState(false);
  const { mutualGuilds, loadingState, error } = useMutualGuildsContext();

  const { discordGuild, isLoading: isLoadingGuild } = useCurrentGuildContext();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  if (loadingState !== "completed" || error || isLoadingGuild) {
    return (
      <div className="flex w-fit items-center gap-3">
        <Skeleton className="w-[30px] h-[30px] rounded-full bg-secondary-foreground/10" />
        <Skeleton className="h-[30px] w-[100px] rounded-sm bg-secondary-foreground/10" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 font-medium">
      <Link
        className="flex items-center gap-2"
        href={discordGuild ? `/dashboard/${discordGuild.id}` : "/servers"}
      >
        <Image
          src={
            discordGuild
              ? getGuildIconURL(discordGuild)
              : "/discord/discord.png"
          }
          height={30}
          width={30}
          className="object-cover aspect-square rounded-full"
          alt="guild icon"
          priority
        />
        <span>{discordGuild?.name ?? "unknown"}</span>
      </Link>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex items-center gap-2 font-semibold px-1 py-2 rounded-md hover:bg-foreground/10">
          <ChevronsUpDown size={17} className="text-foreground/70" />
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search server with id..." />
            <CommandEmpty>No server found.</CommandEmpty>
            <CommandGroup>
              {mutualGuilds.map((guild) => (
                <CommandItem
                  key={guild.id}
                  value={guild.id}
                  onSelect={(currentValue) => {
                    setOpen(false);
                    router.push(`/dashboard/${currentValue}`);
                  }}
                  className={cn(
                    "flex items-center justify-between gap-2",
                    serverId === guild.id && "bg-secondary/20",
                  )}
                >
                  {guild.name}

                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      serverId === guild.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ServerSelectComboBox;
