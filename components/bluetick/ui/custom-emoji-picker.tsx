import { Popover, PopoverTrigger } from '@/components/ui/popover';
import type { DiscordPartialEmoji } from '@/types/bluetick/discord';
import { PopoverContent } from '@radix-ui/react-popover';
import React, { useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Switch } from '@/components/ui/switch';
import { DisplayCustomEmoji } from './emoji-display';
import { Label } from '@/components/ui/label';

interface CustomEmojiPickerProps {
  defaultEmoji?: string;
  onEmojiSelect?: (newEmoji: string) => void;
  discordEmojis?: DiscordPartialEmoji[];
}

const CustomEmojiPicker: React.FC<CustomEmojiPickerProps> = ({
  defaultEmoji,
  onEmojiSelect,
  discordEmojis,
}) => {
  const [open, setOpen] = React.useState(false);

  const [isDefault, setIsDefault] = React.useState(
    defaultEmoji ? !(defaultEmoji.length >= 9) : true
  );

  const [emoji, setEmoji] = React.useState(defaultEmoji ?? '🔥');

  const handleChangeDefault = (): void => {
    if (discordEmojis && discordEmojis.length !== 0) {
      if (isDefault) {
        setEmoji(discordEmojis[0].id);
        setIsDefault(false);
      } else {
        setIsDefault(true);
        setEmoji('🔥');
      }
    }
  };

  useEffect(
    () => {
      if (onEmojiSelect) {
        onEmojiSelect(emoji);
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [emoji]
  );

  return (
    <div className="flex gap-2 items-center">
      {isDefault ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="px-3 min-h-10 border rounded-md bg-background cursor-pointer items-center flex">
              {emoji}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <EmojiPicker
              onEmojiClick={(value) => {
                setEmoji(value.emoji);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="px-3 py-1 border rounded-md bg-background cursor-pointer min-h-10 flex items-center">
              <DisplayCustomEmoji id={emoji} />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid grid-cols-7 p-2 gap-1 rounded-lg bg-white max-h-[200px] overflow-y-auto ">
              {discordEmojis?.map((e) => (
                <div
                  key={e.id}
                  onClick={() => {
                    setEmoji(e.id);
                    setOpen(false);
                  }}
                >
                  <DisplayCustomEmoji
                    id={e.id}
                    className="cursor-pointer hover:bg-gray-200 h-8 w-8 p-[2px] rounded-md "
                  />
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
      {discordEmojis && discordEmojis.length !== 0 && (
        <div className="flex flex-col gap-1">
          <Label className="text-gray-500">Use default emoji?</Label>
          <div className="flex items-center gap-2">
            <Switch
              size={'xs'}
              checked={isDefault}
              onClick={handleChangeDefault}
            />
            <Label className="text-gray-500">{isDefault ? 'Yes' : 'No'}</Label>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomEmojiPicker;
