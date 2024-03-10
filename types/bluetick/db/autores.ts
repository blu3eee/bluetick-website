import { MessageInfoDetails } from '..';
import { BotDetails } from './bot';
import { GuildDetails } from './guild';

export class UpdateAutoResponseDto {
  trigger?: string;
  response?: MessageInfoDetails;
}

export type AutoResponseDetails = {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  trigger: string;
  response: MessageInfoDetails;
};

export interface CreateAutoResponseDto {
  botID: string;
  guildID: string;
  trigger: string;
  response: MessageInfoDetails;
}
