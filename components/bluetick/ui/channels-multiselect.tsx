"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

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
import { CheckIcon, ChevronDown } from "lucide-react";
import type { DiscordPartialGuildChannel } from "@/types/bluetick/discord";
import { Icons } from "@/components/icons";

interface Props {
  options: DiscordPartialGuildChannel[];
  selectedChannels: string[];
  onSelect: (ids: string[]) => void;
}

export const ChannelsMultiSelect: React.FC<Props> = ({
  options,
  selectedChannels,
  onSelect,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  React.useEffect(() => {
    const values = options.filter((option) =>
      selectedChannels.includes(option.id),
    );
    setSelectedValues(
      values.map((value) => `${value.id}_${value.name.toLowerCase()}`),
    );
  }, [selectedChannels, options]);

  const handleRemoveChannel = (value: string): void => {
    const id = value.split("_")[0];

    setSelectedValues(selectedValues.filter((val) => val !== value));
    onSelect(selectedChannels.filter((val) => val !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-foreground/50 px-4 py-2 text-foreground/70 hover:bg-background"
        >
          Select channels...
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-80" />
        </div>
      </PopoverTrigger>
      <div className="flex flex-wrap gap-2">
        {selectedValues.map((value, index) => {
          const selectedValue = options.find(
            (c) => `${c.id}_${c.name.toLowerCase()}` === value,
          );

          return (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md bg-blue-500 px-2 py-1 text-sm text-white"
            >
              {selectedValue?.name ?? "Unknown"}
              <Icons.close
                size={16}
                onClick={() => {
                  handleRemoveChannel(value);
                }}
                className="cursor-pointer"
              />
            </div>
          );
        })}
      </div>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search channel..."
            className="h-9 w-full"
          />
          <CommandEmpty>No channel found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] w-full overflow-y-auto">
            {options.map((channel) => (
              <CommandItem
                key={channel.id}
                value={`${channel.id}_${channel.name.toLowerCase()}`}
                onSelect={(currentValue) => {
                  const selected = options.find(
                    (option) =>
                      `${option.id}_${option.name}`.toLowerCase() ===
                      currentValue,
                  );
                  if (selected) {
                    const value =
                      `${selected.id}_${selected.name}`.toLowerCase();
                    const newSelectedValues = selectedValues.includes(value)
                      ? selectedValues.filter(
                          (val) => !val.includes(selected.id),
                        )
                      : [...selectedValues, value];
                    setSelectedValues(newSelectedValues);
                    onSelect(
                      selectedValues.includes(value)
                        ? selectedChannels.filter((id) => id !== selected.id)
                        : [...selectedChannels, selected.id],
                    );
                  }
                  //   setOpen(false);
                }}
                className="w-full"
              >
                {channel.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedValues.includes(
                      `${channel.id}_${channel.name}`.toLowerCase(),
                    )
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
