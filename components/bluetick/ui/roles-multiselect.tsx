import type { DiscordRole } from '@/types/bluetick/discord';
import React from 'react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CheckIcon, ChevronDown } from 'lucide-react';
import { Icons } from '@/components/icons';

interface Props {
  options: DiscordRole[];
  selectedRoles: string[];
  onSelect: (ids: string[]) => void;
}

const RolesMultiSelect: React.FC<Props> = ({
  options,
  selectedRoles,
  onSelect,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  React.useEffect(() => {
    const values = options.filter((option) =>
      selectedRoles.includes(option.id)
    );
    setSelectedValues(
      values.map((value) => `${value.id}_${value.name.toLowerCase()}`)
    );
  }, [selectedRoles, options]);

  const handleRemoveRolesMultiSelect = (value: string): void => {
    const id = value.split('_')[0];

    setSelectedValues(selectedValues.filter((val) => val !== value));
    onSelect(selectedRoles.filter((val) => val !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          aria-expanded={open}
          className="flex items-center justify-between w-full px-4 py-2 border rounded-lg cursor-pointer hover:bg-background border-foreground/50 text-foreground/70"
        >
          Select roles...
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-80" />
        </div>
      </PopoverTrigger>
      <div className="flex flex-wrap gap-2">
        {selectedValues.map((value, index) => {
          const selectedValue = options.find(
            (c) => `${c.id}_${c.name.toLowerCase()}` === value
          );

          return (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-500 rounded-md px-2 py-1 text-white text-sm"
            >
              {selectedValue?.name ?? 'Unknown'}
              <Icons.close
                size={16}
                onClick={() => {
                  handleRemoveRolesMultiSelect(value);
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
            placeholder="Search RolesMultiSelect..."
            className="h-9 w-full"
          />
          <CommandEmpty>No role found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto w-full">
            {options.map((RolesMultiSelect) => (
              <CommandItem
                key={RolesMultiSelect.id}
                value={`${
                  RolesMultiSelect.id
                }_${RolesMultiSelect.name.toLowerCase()}`}
                onSelect={(currentValue) => {
                  const selected = options.find(
                    (option) =>
                      `${option.id}_${option.name}`.toLowerCase() ===
                      currentValue
                  );
                  if (selected) {
                    const value =
                      `${selected.id}_${selected.name}`.toLowerCase();
                    const newSelectedValues = selectedValues.includes(value)
                      ? selectedValues.filter(
                          (val) => !val.includes(selected.id)
                        )
                      : [...selectedValues, value];
                    setSelectedValues(newSelectedValues);
                    onSelect(
                      selectedValues.includes(value)
                        ? selectedRoles.filter((id) => id !== selected.id)
                        : [...selectedRoles, selected.id]
                    );
                  }
                  //   setOpen(false);
                }}
                className="w-full"
              >
                {RolesMultiSelect.name}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    selectedValues.includes(
                      `${RolesMultiSelect.id}_${RolesMultiSelect.name}`.toLowerCase()
                    )
                      ? 'opacity-100'
                      : 'opacity-0'
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

export default RolesMultiSelect;
