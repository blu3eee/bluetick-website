import { BotDetails } from './bot';
import { GuildDetails } from './guild';

export type BotGuildConfig = {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  prefix: string;
  locale: string;
  moduleFlags: number;
  premiumFlags: number;
};

export type UpdateGuildConfig = {
  prefix?: string;
  locale?: string;
  moduleFlags?: number;
  premiumFlags?: number;
};

export enum GuildModules {
  WELCOME = 1 << 1,
  AUTO_RESPONSE = 1 << 2,
  TICKET = 1 << 3,
  BOOKING = 1 << 4,
  GIVEAWAYS = 1 << 5,
  AUTO_MESSAGE = 1 << 6,
  TWITCH = 1 << 7,
  YOUTUBE = 1 << 8,
  MESSAGE_EMBEDDER = 1 << 9,
  AUTOROLES = 1 << 10,
  ACTION_LOGS = 1 << 11,
}
