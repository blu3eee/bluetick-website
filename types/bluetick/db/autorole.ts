import { type BotDetails } from "./bot";
import { type GuildDetails } from "./guild";

export interface CreateAutoRoleDto {
  botID: string;
  guildID: string;
  type: string;
  roleID: string;
  delay: number;
}

export interface AutoRoleDetails {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  type: string;
  roleID: string;
  delay: number;
}
