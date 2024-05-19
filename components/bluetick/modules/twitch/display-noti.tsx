import { getBotAvatarURL } from "@/lib/helper";
import type { BotAllDetails, MessageInfoDetails } from "@/types/bluetick";
import React from "react";
import DiscordMessage from "../../discord/message";
import { replacePlaceholders } from "@/lib/utils";

interface Props {
  botDetails: BotAllDetails;
  message: MessageInfoDetails;
  streamerDetails: Record<string, string>;
}

const DisplayNotificationMessage: React.FC<Props> = ({
  botDetails,
  message,
  streamerDetails,
}) => {
  streamerDetails = {
    ...streamerDetails,
    everyone: "@everyone",
    here: "@here",
  };
  return (
    <div className="rounded-md bg-discord py-2 text-white">
      <DiscordMessage
        author={{
          name: "Bluetick",
          avatarURL: getBotAvatarURL(botDetails),
        }}
        message={{
          userID: "bot",
          content:
            message.type !== "Embed" && message.content
              ? replacePlaceholders(message.content, streamerDetails)
              : "",
          embeds:
            message.type !== "Message" && message.embed
              ? [
                  {
                    author: {
                      name: replacePlaceholders(
                        message.embed.author ?? "",
                        streamerDetails,
                      ),
                      iconURL: replacePlaceholders(
                        message.embed.authorURL ?? "",
                        streamerDetails,
                      ),
                    },
                    title: replacePlaceholders(
                      message.embed.title ?? "",
                      streamerDetails,
                    ),
                    url: replacePlaceholders(
                      message.embed.url ?? "",
                      streamerDetails,
                    ),
                    description: replacePlaceholders(
                      message.embed.description ?? "",
                      streamerDetails,
                    ),
                    footer: {
                      text: replacePlaceholders(
                        message.embed.footer ?? "",
                        streamerDetails,
                      ),
                      iconURL: replacePlaceholders(
                        message.embed.footerURL ?? "",
                        streamerDetails,
                      ),
                    },
                    thumbnailURL: replacePlaceholders(
                      message.embed.thumbnail ?? "",
                      streamerDetails,
                    ),
                    imageURL: replacePlaceholders(
                      message.embed.image ?? "",
                      streamerDetails,
                    ),
                    timestamp: "",
                    color: message.embed.color ?? "",
                  },
                ]
              : [],
          attachments: [],
          timestamp: new Date(2024, 0, 1).valueOf(),
        }}
        users={{}}
      />
    </div>
  );
};

export default DisplayNotificationMessage;
