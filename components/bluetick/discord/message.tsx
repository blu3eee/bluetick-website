import { RenderHtmlContent } from "@/components/custom-ui/styled-text";
import { replaceIds } from "@/lib/discord";
import { isValidImageUrl } from "@/lib/validators";
import type { TranscriptMessage } from "@/types/bluetick/db/tickets";
import React from "react";
import DiscordEmbed from "./embed";
import ImageGallery from "../../custom-ui/images-galery";
import Image from "next/image";
import { Icons } from "@/components/icons";

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
    <div className="group flex h-fit gap-2 px-2 hover:bg-[#4b484f]">
      {displayUser ? (
        <Image
          src={author.avatarURL}
          alt={author.name}
          width={30}
          height={30}
          className={`mt-1 h-fit rounded-full`}
        />
      ) : (
        <span className="mt-1 w-[30px] text-xs font-bold text-gray-400 opacity-0 group-hover:opacity-100">
          {(messageTime.getHours() % 12).toString().padStart(2, "0")}:
          {messageTime.getMinutes().toString().padStart(2, "0")}
        </span>
      )}
      <div className="flex flex-col justify-center">
        {displayUser && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{author.name}</span>
            <span className="text-sm font-semibold text-gray-400">
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
        {message.attachments
          .filter((a) => !isValidImageUrl(a.url))
          .map((attachment, i) => (
            <a
              key={i}
              href={attachment.url}
              className="group/file relative mt-1 flex max-w-[400px] items-center gap-2 rounded-md border-2 border-[#2B2D31] bg-[#2B2D31aa] p-2"
            >
              <div className="h-6 w-6">
                {attachment.name.includes(".doc") ? (
                  <Icons.fileText />
                ) : attachment.name.includes(".pdf") ? (
                  <Icons.pdf />
                ) : attachment.name.includes(".zip") ? (
                  <Icons.zip />
                ) : (
                  <Icons.page />
                )}
              </div>
              <span className="text-sm text-blue-500">{attachment.name}</span>
              <div className="absolute right-[-10px] rounded-md border-2 border-[#2B2D31] bg-[#38343c] p-1 opacity-0 group-hover/file:opacity-100">
                <Icons.download size={16} />
              </div>
            </a>
          ))}
      </div>
    </div>
  );
};

export default DiscordMessage;
