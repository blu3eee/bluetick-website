import { BotDetails } from '../bot';
import { GuildDetails } from '../guild';

export interface CreateGuildLogSettingDto {
  botID: string;
  guildID: string;
  specifyChannels?: boolean;
  newAccountAge?: number;
}

export interface UpdateGuildLogSettingDto {
  specifyChannels?: boolean;
  newAccountAge?: number;
}

export interface GuildLogSettingDetails {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  specifyChannels: boolean;
  newAccountAge: number;
}
