import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { TicketPanelDetails } from '@/types/bluetick/db/tickets';
import { CheckSquare2, Square } from 'lucide-react';
import React from 'react';

interface MultiSelectPanelsProps {
  options: TicketPanelDetails[];
  selectedMentions: string[];
  onMentionsChange: (new_mentions: string[]) => void;
}

const MultiSelectPanels: React.FC<MultiSelectPanelsProps> = ({
  options,
  selectedMentions,
  onMentionsChange,
}) => {
  // State and hooks setup
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = React.useState<number | string>(
    'auto'
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

  const getNameById = (id: string): string => {
    const role = options.find((role) => String(role.id) === id);
    return role?.button.text ?? 'Unknown role';
  };

  const togglePanel = (mention: string): void => {
    onMentionsChange(
      selectedMentions.includes(mention)
        ? selectedMentions.filter((t) => t !== mention)
        : [...selectedMentions, mention]
    );
  };
  const removePanel = (mentionId: string): void => {
    onMentionsChange(selectedMentions.filter((t) => t !== mentionId));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          className="border bg-background justify-start p-2 rounded-md truncate text-sm cursor-pointer flex flex-wrap gap-2 w-full min-h-10"
        >
          {selectedMentions.length > 0 ? (
            selectedMentions.map((roleId) => {
              const name = getNameById(roleId);
              return (
                <Badge
                  key={roleId}
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-500/60 focus:bg-blue-500/50 text-white text-xs"
                >
                  {name}
                  <Icons.close
                    size="12"
                    className="cursor-pointer"
                    onClick={() => {
                      removePanel(roleId);
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
        style={{ width: popoverWidth, minWidth: '240px' }}
        className="p-2"
      >
        <Command>
          <CommandGroup className="max-h-[300px] overflow-y-auto w-full">
            {options.length > 0 ? (
              options.map((panel) => (
                <CommandItem
                  key={panel.id}
                  className="flex aria-selected:bg-accent/50 items-center gap-2"
                  onSelect={() => {
                    togglePanel(String(panel.id));
                  }}
                >
                  {selectedMentions.includes(String(panel.id)) ? (
                    <CheckSquare2 className={`ml-2`} />
                  ) : (
                    <Square className={`ml-2`} />
                  )}
                  {panel.button.text}
                </CommandItem>
              ))
            ) : (
              <CommandItem className="aria-selected:bg-accent/50">
                No panel found
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectPanels;
