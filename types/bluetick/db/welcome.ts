import { MessageInfoDetails } from '..';
import { BotDetails } from './bot';
import { GuildDetails } from './guild';

export type BotGuildWelcomeDetails = {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  channelID: string;
  message: MessageInfoDetails;
};

export type UpdateBotGuildWelcomeDetails = {
  channelID?: string;
  message?: MessageInfoDetails;
};
