import { MessageInfoDetails } from '../bluetick';
import { BotDetails } from '../bluetick/db/bot';
import { GuildDetails } from '../bluetick/db/guild';

export interface TwitchWatcherDetails {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  twitchUserId: string;
  postChannelId: string;
  liveMessageId?: string;
  message: MessageInfoDetails;
}

export interface CreateTwitchWatcherDto {
  botID: string;
  guildID: string;
  twitchUserId: string;
  postChannelId: string;
  message: MessageInfoDetails;
}

export interface UpdateTwitchWatcherDto {
  postChannelId?: string;
  message?: MessageInfoDetails;
  liveMessageId?: string;
}
