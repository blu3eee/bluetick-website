import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface DisplayCustomEmojiProps {
  id: string;
  className?: string;
}

export const DisplayCustomEmoji: React.FC<DisplayCustomEmojiProps> = ({
  id,
  className,
}) => {
  return (
    <Image
      src={`https://cdn.discordapp.com/emojis/${id}.png`}
      alt={id}
      width={150}
      height={150}
      className={cn("w-6 h-6", className)}
      priority
    />
  );
};
