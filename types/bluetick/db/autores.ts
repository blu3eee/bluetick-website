import { type MessageInfoDetails } from "..";
import { type BotDetails } from "./bot";
import { type GuildDetails } from "./guild";

export class UpdateAutoResponseDto {
  trigger?: string;
  response?: MessageInfoDetails;
}

export interface AutoResponseDetails {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  trigger: string;
  response: MessageInfoDetails;
}

export interface CreateAutoResponseDto {
  botID: string;
  guildID: string;
  trigger: string;
  response: MessageInfoDetails;
}
