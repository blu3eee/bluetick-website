import React from 'react';
import { RenderHtmlContent } from '@/components/custom-ui/styled-text';
import { replaceIds } from '@/lib/discord';
import { cn } from '@/lib/utils';
import { isValidImageUrl, isValidUrl } from '@/lib/validators';
import type { TranscriptEmbed } from '@/types/bluetick/db/tickets';
import Image from 'next/image';
import Link from 'next/link';

interface DiscordEmbedProps {
  embed: TranscriptEmbed;
  users: Record<string, { name: string; avatarURL: string }>;
  roles?: Record<string, { name: string }>;
  channels?: Record<string, { name: string }>;
}

const DiscordEmbed: React.FC<DiscordEmbedProps> = ({
  embed,
  users,
  roles,
  channels,
}) => {
  return (
    <div
      className="rounded-md w-fit min-w-[256px] max-w-[720px] min-h-8"
      style={{ backgroundColor: embed.color ?? `#ffffff` }}
    >
      <div className="bg-[#2B2D31] ml-1 px-3 py-2 rounded-tr-sm rounded-br-sm flex flex-col justify-between min-h-8">
        <div className="flex justify-between w-full">
          {/* left column */}
          <div className="flex-1 flex flex-col">
            {/* author */}
            {embed.author && (
              <div className="flex gap-2 items-center">
                {embed.author.iconURL &&
                  isValidImageUrl(embed.author.iconURL) && (
                    <div className="w-[25px] h-[25px]">
                      <Image
                        src={embed.author.iconURL}
                        alt="thumbnail"
                        height={100}
                        width={100}
                        className="rounded-full"
                      />
                    </div>
                  )}
                <div className="text-sm font-semibold">{embed.author.name}</div>
              </div>
            )}

            {/* title */}
            {embed.title && (
              <Link
                className={cn(
                  'flex items-center font-bold my-1',
                  embed.url
                    ? 'underline cursor-pointer hover:text-foreground/80'
                    : ''
                )}
                href={embed.url && isValidUrl(embed.url) ? embed.url : ''}
              >
                {embed.title}
              </Link>
            )}

            {/* description */}
            {embed?.description && (
              <div className="flex my-1 text-sm flex flex-col">
                <RenderHtmlContent
                  text={replaceIds(embed.description, users, roles, channels)}
                />
              </div>
            )}
          </div>
          {/* right column */}
          {embed.thumbnailURL && isValidImageUrl(embed.thumbnailURL) && (
            <div className="ml-2">
              <Image
                src={embed.thumbnailURL}
                alt="thumbnail"
                height={100}
                width={150}
                className="rounded-md max-w-[72px] max-h-[72px] w-auto h-auto object-cover"
              />
            </div>
          )}
        </div>

        {embed.imageURL && isValidImageUrl(embed.imageURL) && (
          <div className="w-full my-1 overflow-hidden">
            <Image
              src={embed.imageURL}
              alt="image"
              height={250}
              width={250}
              className="w-full h-auto rounded-md object-cover max-h-[256px] w-auto"
            />
          </div>
        )}
        {embed.footer?.text && (
          <div className="flex items-center gap-2 my-1">
            {embed.footer.iconURL && isValidImageUrl(embed.footer.iconURL) && (
              <div className="w-[24px] h-[24px]">
                <Image
                  src={embed.footer.iconURL}
                  alt="footer icon"
                  height={250}
                  width={250}
                  className="rounded-full"
                />
              </div>
            )}
            <span className="text-xs">{embed.footer.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default DiscordEmbed;
