import { RenderHtmlContent } from "@/components/custom-ui/styled-text";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn, replacePlaceholders } from "@/lib/utils";
import { isValidImageUrl, isValidUrl } from "@/lib/validators";
import type { ButtonInfoDetails, MessageInfoDetails } from "@/types/bluetick";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DisplayCustomEmoji } from "./emoji-display";

interface MessagePreviewProps {
  type: string;
  message: MessageInfoDetails;
  buttons?: ButtonInfoDetails[];
  placeholders?: Record<string, string>;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({
  message,
  type,
  buttons,
  placeholders = {},
}) => {
  return (
    <div>
      <Label htmlFor="preview" className="font-semibold uppercase text-red-400">
        Preview
      </Label>
      <div className="mt-2 w-full rounded-lg bg-[#38343c] p-4 text-white">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-semibold">{"Bluetick"}</span>
          <span className="rounded-md bg-blue-400 px-[4px] py-[1px] text-[10px] font-bold">
            BOT
          </span>
          <span className="text-xs font-semibold text-gray-500">
            Today at 01:01 AM
          </span>
        </div>
        {type !== "Embed" && message.content && (
          <div className="my-1 flex flex flex-col text-sm">
            {replacePlaceholders(message.content, placeholders)
              .split("\n")
              .map((line, index) => {
                return (
                  <span key={index}>
                    <RenderHtmlContent text={line} />
                  </span>
                );
              })}
          </div>
        )}
        {/* whole embed */}
        {type !== "Message" && message.embed && (
          <div
            className="min-h-8 w-fit min-w-[256px] max-w-[720px] rounded-md"
            style={{ backgroundColor: message.embed.color ?? `#ffffff` }}
          >
            <div className="ml-1 flex min-h-8 flex-col justify-between rounded-br-sm rounded-tr-sm bg-[#2B2D31] px-3 py-2">
              <div className="flex w-full justify-between">
                {/* left part */}
                <div className="flex flex-1 flex-col">
                  {/* author */}
                  {message.embed.author && (
                    <div className="flex items-center gap-2">
                      {message.embed.authorURL &&
                        isValidImageUrl(message.embed.authorURL) && (
                          <div className="h-[25px] w-[25px]">
                            <Image
                              src={replacePlaceholders(
                                message.embed.authorURL,
                                placeholders,
                              )}
                              alt="thumbnail"
                              height={100}
                              width={100}
                              className="rounded-full"
                            />
                          </div>
                        )}
                      <div className="text-sm font-semibold">
                        {replacePlaceholders(
                          message.embed.author,
                          placeholders,
                        )}
                      </div>
                    </div>
                  )}

                  {/* title */}
                  {message.embed.title && (
                    <Link
                      className={cn(
                        "my-1 flex items-center font-bold",
                        message.embed.url
                          ? "cursor-pointer underline hover:text-foreground/80"
                          : "",
                      )}
                      href={replacePlaceholders(
                        message.embed.url &&
                          isValidUrl(
                            replacePlaceholders(
                              message.embed.url,
                              placeholders,
                            ),
                          )
                          ? message.embed.url
                          : "",
                        placeholders,
                      )}
                    >
                      {replacePlaceholders(message.embed.title, placeholders)}
                    </Link>
                  )}

                  {/* description */}
                  {message.embed?.description && (
                    <div className="my-1 flex flex flex-col text-sm">
                      {replacePlaceholders(
                        message.embed.description,
                        placeholders,
                      )
                        .split("\n")
                        .map((line, index) => (
                          <RenderHtmlContent key={index} text={line} />
                        ))}
                    </div>
                  )}
                </div>
                {/* right one */}
                {message.embed.thumbnail &&
                  isValidImageUrl(
                    replacePlaceholders(message.embed.thumbnail, placeholders),
                  ) && (
                    <div className="ml-2">
                      <Image
                        src={replacePlaceholders(
                          message.embed.thumbnail,
                          placeholders,
                        )}
                        alt="thumbnail"
                        height={100}
                        width={150}
                        className="h-auto max-h-[72px] w-auto max-w-[72px] rounded-md object-cover"
                      />
                    </div>
                  )}
              </div>

              {message.embed.image &&
                isValidImageUrl(
                  replacePlaceholders(message.embed.image, placeholders),
                ) && (
                  <div className="my-1 w-full overflow-hidden">
                    <Image
                      src={replacePlaceholders(
                        message.embed.image,
                        placeholders,
                      )}
                      alt="image"
                      height={250}
                      width={250}
                      className="h-auto max-h-[256px] w-auto w-full rounded-md object-cover"
                    />
                  </div>
                )}
              {message.embed.footer && (
                <div className="my-1 flex items-center gap-2">
                  {message.embed.footerURL &&
                    isValidImageUrl(
                      replacePlaceholders(
                        message.embed.footerURL,
                        placeholders,
                      ),
                    ) && (
                      <div className="h-[24px] w-[24px]">
                        <Image
                          src={replacePlaceholders(
                            message.embed.footerURL,
                            placeholders,
                          )}
                          alt="footer icon"
                          height={250}
                          width={250}
                          className="rounded-full"
                        />
                      </div>
                    )}
                  <span className="text-xs">{message.embed.footer}</span>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="mt-2 flex w-fit flex-wrap items-center gap-2">
          {buttons
            ? buttons.map((button, index) => (
                <Button
                  key={index}
                  className="items-center gap-3 px-3"
                  style={{
                    backgroundColor: getButtonColor(button.color),
                  }}
                >
                  {button.emoji.length >= 9 ? (
                    <DisplayCustomEmoji id={button.emoji} />
                  ) : (
                    <span>{button.emoji}</span>
                  )}
                  <span className="font-semibold text-white">
                    {button.text}
                  </span>
                </Button>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default MessagePreview;

const getButtonColor = (color: string): string => {
  color = color.toLowerCase();
  return color === `blue`
    ? `#656afa`
    : color.toLowerCase() === `green`
      ? `#49be89`
      : color.toLowerCase() === `red`
        ? `#f3534b`
        : `#595e68`;
};
