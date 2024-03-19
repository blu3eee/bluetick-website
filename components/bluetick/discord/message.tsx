import { RenderHtmlContent } from '@/components/custom-ui/styled-text';
import { replaceIds } from '@/lib/discord';
import { isValidImageUrl } from '@/lib/validators';
import type { TranscriptMessage } from '@/types/bluetick/db/tickets';
import React from 'react';
import DiscordEmbed from './embed';
import ImageGallery from '../../custom-ui/images-galery';
import Image from 'next/image';

const DiscordMessage: React.FC<{
  author: { name: string; avatarURL: string };
  message: TranscriptMessage;
  displayUser?: boolean;
  users: Record<string, { name: string; avatarURL: string }>;
  roles?: Record<string, { name: string }>;
  channels?: Record<string, { name: string }>;
}> = ({ author, message, users, displayUser = true, roles, channels }) => {
  const messageTime = new Date(message.timestamp);
  return (
    <div className="group px-2 flex gap-2 hover:bg-[#4b484f] h-fit">
      {displayUser ? (
        <Image
          src={author.avatarURL}
          alt={author.name}
          width={30}
          height={30}
          className={`rounded-full h-fit mt-1`}
        />
      ) : (
        <span className="w-[30px] text-xs font-bold text-gray-300 opacity-0 group-hover:opacity-100 mt-1">
          {(messageTime.getHours() % 12).toString().padStart(2, '0')}:
          {messageTime.getMinutes().toString().padStart(2, '0')}
        </span>
      )}
      <div className="flex flex-col justify-center">
        {displayUser && (
          <div className="flex gap-2 items-center">
            <span className="font-semibold">{author.name}</span>
            <span className="font-semibold text-sm text-foreground/70">
              {new Date(message.timestamp).toLocaleString()}
            </span>
          </div>
        )}
        {message.content && (
          <span className="text-md">
            <RenderHtmlContent
              text={replaceIds(message.content, users, roles, channels)}
            />
          </span>
        )}
        {message?.embeds.map((embed, index) => (
          <DiscordEmbed
            key={index}
            embed={embed}
            users={users}
            roles={roles}
            channels={channels}
          />
        ))}
        {message.attachments && (
          <div className="max-w-[720px]">
            <ImageGallery
              urls={message.attachments
                .filter((a) => isValidImageUrl(a.url))
                .map((a) => a.url)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscordMessage;
