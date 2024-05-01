import type { TicketSupportTeamDetails } from "@/types/bluetick/db/tickets";
import React from "react";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
interface SupportTeamSelectProps {
  options: TicketSupportTeamDetails[];
  selectedTeamId: number;
  onSelect: (newId: number) => void;
}

const SupportTeamSelect: React.FC<SupportTeamSelectProps> = ({
  options,
  selectedTeamId,
  onSelect,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    const selectedValue = options.find(
      (option) => option.id === selectedTeamId,
    );
    if (selectedValue) {
      setValue(`${selectedValue.id}_${selectedValue.name.toLowerCase()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeamId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {value
            ? options.find((c) => `${c.id}_${c.name.toLowerCase()}` === value)
                ?.name
            : "Select team..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-80" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search channel..."
            className="h-9 w-full"
          />
          <CommandEmpty>No team found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto w-full">
            {options.map((channel) => (
              <CommandItem
                key={channel.id}
                value={`${channel.id}_${channel.name.toLowerCase()}`}
                onSelect={(currentValue) => {
                  const selectedValue = options.find(
                    (option) =>
                      `${option.id}_${option.name}`.toLowerCase() ===
                      currentValue,
                  );
                  if (selectedValue) {
                    setValue(currentValue === value ? "" : currentValue);
                    onSelect(selectedValue.id);
                  }
                  setOpen(false);
                }}
                className="w-full"
              >
                {channel.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === `${channel.id}_${channel.name.toLowerCase()}`
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

export default SupportTeamSelect;
