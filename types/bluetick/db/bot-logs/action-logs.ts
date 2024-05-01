import { type BotDetails } from "../bot";
import { type GuildDetails } from "../guild";

// guild-action-logs.dto.ts
export interface CreateActionLogDto {
  botID: string;
  guildID: string;
  channelID: string;
  events: string;
}

export interface UpdateActionLogDto {
  channelID?: string;
  events?: string;
}

export interface BotGuildActionLogDetails {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  channelID: string;
  events: string;
}
