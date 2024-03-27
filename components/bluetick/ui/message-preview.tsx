import { RenderHtmlContent } from '@/components/custom-ui/styled-text';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn, replacePlaceholders } from '@/lib/utils';
import { isValidImageUrl, isValidUrl } from '@/lib/validators';
import type { ButtonInfoDetails, MessageInfoDetails } from '@/types/bluetick';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { DisplayCustomEmoji } from './emoji-display';

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
      <Label htmlFor="preview" className="uppercase font-semibold text-red-400">
        Preview
      </Label>
      <div className="w-full p-4 bg-[#38343c] rounded-lg mt-2 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">{'Bluetick'}</span>
          <span className="text-[10px] font-bold px-[4px] py-[1px] bg-blue-400 rounded-md">
            BOT
          </span>
          <span className="font-semibold text-xs text-gray-500">
            Today at 01:01 AM
          </span>
        </div>
        {type !== 'Embed' && message.content && (
          <div className="flex my-1 text-sm flex flex-col">
            {replacePlaceholders(message.content, placeholders)
              .split('\n')
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
        {type !== 'Message' && message.embed && (
          <div
            className="rounded-md w-fit min-w-[256px] max-w-[720px] min-h-8"
            style={{ backgroundColor: message.embed.color ?? `#ffffff` }}
          >
            <div className="bg-[#2B2D31] ml-1 px-3 py-2 rounded-tr-sm rounded-br-sm flex flex-col justify-between min-h-8">
              <div className="flex justify-between w-full">
                {/* left part */}
                <div className="flex-1 flex flex-col">
                  {/* author */}
                  {message.embed.author && (
                    <div className="flex gap-2 items-center">
                      {message.embed.authorURL &&
                        isValidImageUrl(message.embed.authorURL) && (
                          <div className="w-[25px] h-[25px]">
                            <Image
                              src={replacePlaceholders(
                                message.embed.authorURL,
                                placeholders
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
                          placeholders
                        )}
                      </div>
                    </div>
                  )}

                  {/* title */}
                  {message.embed.title && (
                    <Link
                      className={cn(
                        'flex items-center font-bold my-1',
                        message.embed.titleURL
                          ? 'underline cursor-pointer hover:text-foreground/80'
                          : ''
                      )}
                      href={replacePlaceholders(
                        message.embed.titleURL &&
                          isValidUrl(
                            replacePlaceholders(
                              message.embed.titleURL,
                              placeholders
                            )
                          )
                          ? message.embed.titleURL
                          : '',
                        placeholders
                      )}
                    >
                      {replacePlaceholders(message.embed.title, placeholders)}
                    </Link>
                  )}

                  {/* description */}
                  {message.embed?.description && (
                    <div className="flex my-1 text-sm flex flex-col">
                      {replacePlaceholders(
                        message.embed.description,
                        placeholders
                      )
                        .split('\n')
                        .map((line, index) => (
                          <RenderHtmlContent key={index} text={line} />
                        ))}
                    </div>
                  )}
                </div>
                {/* right one */}
                {message.embed.thumbnail &&
                  isValidImageUrl(
                    replacePlaceholders(message.embed.thumbnail, placeholders)
                  ) && (
                    <div className="ml-2">
                      <Image
                        src={replacePlaceholders(
                          message.embed.thumbnail,
                          placeholders
                        )}
                        alt="thumbnail"
                        height={100}
                        width={150}
                        className="rounded-md max-w-[72px] max-h-[72px] w-auto h-auto object-cover"
                      />
                    </div>
                  )}
              </div>

              {message.embed.image &&
                isValidImageUrl(
                  replacePlaceholders(message.embed.image, placeholders)
                ) && (
                  <div className="w-full my-1 overflow-hidden">
                    <Image
                      src={replacePlaceholders(
                        message.embed.image,
                        placeholders
                      )}
                      alt="image"
                      height={250}
                      width={250}
                      className="w-full h-auto rounded-md object-cover max-h-[256px] w-auto"
                    />
                  </div>
                )}
              {message.embed.footer && (
                <div className="flex items-center gap-2 my-1">
                  {message.embed.footerURL &&
                    isValidImageUrl(
                      replacePlaceholders(message.embed.footerURL, placeholders)
                    ) && (
                      <div className="w-[24px] h-[24px]">
                        <Image
                          src={replacePlaceholders(
                            message.embed.footerURL,
                            placeholders
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
        <div className="mt-2 flex flex-wrap items-center gap-2 w-fit">
          {buttons
            ? buttons.map((button, index) => (
                <Button
                  key={index}
                  className="gap-3 px-3 items-center"
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
