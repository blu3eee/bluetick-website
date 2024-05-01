import { type MessageInfoDetails } from "..";
import { type BotDetails } from "./bot";
import { type GuildDetails } from "./guild";

export interface BotGuildWelcomeDetails {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  channelID: string;
  message: MessageInfoDetails;
}

export interface UpdateBotGuildWelcomeDetails {
  channelID?: string;
  message?: MessageInfoDetails;
}
