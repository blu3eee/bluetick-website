import React from "react";
import { RenderHtmlContent } from "@/components/custom-ui/styled-text";
import { replaceIds } from "@/lib/discord";
import { cn } from "@/lib/utils";
import { isValidImageUrl, isValidUrl } from "@/lib/validators";
import type { TranscriptEmbed } from "@/types/bluetick/db/tickets";
import Image from "next/image";
import Link from "next/link";

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
      className="min-h-8 w-fit min-w-[256px] max-w-[720px] rounded-md"
      style={{ backgroundColor: embed.color ?? `#ffffff` }}
    >
      <div className="ml-1 flex min-h-8 flex-col justify-between rounded-br-sm rounded-tr-sm bg-[#2B2D31] px-3 py-2">
        <div className="flex w-full justify-between">
          {/* left column */}
          <div className="flex flex-1 flex-col">
            {/* author */}
            {embed.author && (
              <div className="flex items-center gap-2">
                {embed.author.iconURL &&
                  isValidImageUrl(embed.author.iconURL) && (
                    <div className="h-[25px] w-[25px]">
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
                  "my-1 flex items-center font-bold",
                  embed.url
                    ? "cursor-pointer underline hover:text-foreground/80"
                    : "",
                )}
                href={embed.url && isValidUrl(embed.url) ? embed.url : ""}
              >
                {embed.title}
              </Link>
            )}

            {/* description */}
            {embed?.description && (
              <div className="my-1 flex flex flex-col text-sm">
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
                className="h-auto max-h-[72px] w-auto max-w-[72px] rounded-md object-cover"
              />
            </div>
          )}
        </div>

        {embed.imageURL && isValidImageUrl(embed.imageURL) && (
          <div className="my-1 w-full overflow-hidden">
            <Image
              src={embed.imageURL}
              alt="image"
              height={250}
              width={250}
              className="h-auto max-h-[256px] w-auto w-full rounded-md object-cover"
            />
          </div>
        )}
        {embed.footer?.text && (
          <div className="my-1 flex items-center gap-2">
            {embed.footer.iconURL && isValidImageUrl(embed.footer.iconURL) && (
              <div className="h-[24px] w-[24px]">
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
