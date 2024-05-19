import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DiscordRole } from "@/types/bluetick/discord";
import { CheckSquare2, Square } from "lucide-react";
import React from "react";

interface SelectMentionsProps {
  roles: DiscordRole[];
  selectedMentions: string[];
  onMentionsChange: (new_mentions: string[]) => void;
}

const SelectMentions: React.FC<SelectMentionsProps> = ({
  roles,
  selectedMentions,
  onMentionsChange,
}) => {
  // State and hooks setup
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = React.useState<number | string>(
    "auto",
  );

  React.useEffect(() => {
    const triggerElement = triggerRef.current;

    if (triggerElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Use contentRect for width before border, padding, or scrollbar
          setPopoverWidth(entry.contentRect.width);
        }
      });

      // Start observing for resize
      resizeObserver.observe(triggerElement);

      // Clean up observer on component unmount
      return () => {
        resizeObserver.unobserve(triggerElement);
      };
    }
  }, []);

  const [query, setQuery] = React.useState("");

  const filteredRoles = query
    ? roles.filter((role) =>
        role.name.toLowerCase().includes(query.toLowerCase()),
      )
    : roles;

  const getRoleNameById = (id: string): string => {
    if (id === "ticket-opener") {
      return "Ticket Opener";
    }
    const role = roles.find((role) => role.id === id);
    return role ? role.name : "Unknown role";
  };

  const toggleRole = (mention: string): void => {
    onMentionsChange(
      selectedMentions.includes(mention)
        ? selectedMentions.filter((t) => t !== mention)
        : [...selectedMentions, mention],
    );
  };
  const removeRole = (mentionId: string): void => {
    onMentionsChange(selectedMentions.filter((t) => t !== mentionId));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          className="flex min-h-10 w-full cursor-pointer flex-wrap justify-start gap-2 truncate rounded-md border bg-background p-2 text-sm"
        >
          {selectedMentions.length > 0 ? (
            selectedMentions.map((roleId) => {
              const name = getRoleNameById(roleId);
              return (
                <Badge
                  key={roleId}
                  className="flex items-center gap-1 bg-blue-500 text-xs text-white hover:bg-blue-500/60 focus:bg-blue-500/50"
                >
                  {name}
                  <Icons.close
                    size="12"
                    className="cursor-pointer"
                    onClick={() => {
                      removeRole(roleId);
                    }}
                  />
                </Badge>
              );
            })
          ) : (
            <p className="text-zinc-500">Select mention(s) on ticker open</p>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: popoverWidth, minWidth: "240px" }}
        className="p-2"
      >
        <Command>
          <CommandInput
            value={query}
            onValueChange={(e) => {
              setQuery(e);
            }}
            placeholder="Search roles..."
          />
          <CommandGroup className="max-h-[300px] w-full overflow-y-auto">
            <CommandItem
              key={"ticket-opener"}
              className="flex items-center gap-2 aria-selected:bg-accent/50"
              onSelect={() => {
                toggleRole("ticket-opener");
              }}
            >
              {selectedMentions.includes("ticket-opener") ? (
                <CheckSquare2 className={`ml-2`} />
              ) : (
                <Square className={`ml-2`} />
              )}
              Ticker Opener
            </CommandItem>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((tag) => (
                <CommandItem
                  key={tag.id}
                  className="flex items-center gap-2 aria-selected:bg-accent/50"
                  onSelect={() => {
                    toggleRole(tag.id);
                  }}
                >
                  {selectedMentions.includes(tag.id) ? (
                    <CheckSquare2 className={`ml-2`} />
                  ) : (
                    <Square className={`ml-2`} />
                  )}
                  {tag.name}
                </CommandItem>
              ))
            ) : (
              <CommandItem className="aria-selected:bg-accent/50">
                No roles found
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectMentions;
