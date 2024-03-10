import { ButtonInfoDetails, MessageInfoDetails } from '..';
import { BotDetails } from './bot';
import { GuildDetails } from './guild';

export interface UpdateTicketGeneralSettingDto {
  perUserTicketLimit?: number;
  allowUserToCloseTickets?: boolean;
  ticketCloseConfirmation?: boolean;
  ticketNotificationChannel?: string;
  transcriptsChannel?: string;
  threadTicket?: boolean;
  archiveCategory?: string;
  archiveOverflowCategory?: string;
}

export type TicketSettingDetails = {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  perUserTicketLimit: number;
  allowUserToCloseTickets: boolean;
  ticketCloseConfirmation: boolean;
  ticketNotificationChannel?: string;
  transcriptsChannel?: string;
  threadTicket?: boolean;
  archiveCategory?: string;
  archiveOverflowCategory?: string;
};

export interface CreateTicketPanelDto {
  botID: string;
  guildID: string;
  mentionOnOpen: string[];
  namingScheme: string;
  channelID: string;
  message: MessageInfoDetails;
  button: ButtonInfoDetails;
  welcomeMessage: MessageInfoDetails;
  supportTeamID?: number;
  ticketCategory?: string;
}

export interface UpdateTicketPanelDto {
  mentionOnOpen?: string[];
  sentMessageID?: string;
  namingScheme?: string;
  channelID?: string;
  message?: MessageInfoDetails;
  button?: ButtonInfoDetails;
  welcomeMessage?: MessageInfoDetails;
  supportTeamID?: number;
  ticketCategory?: string;
}

export interface TicketPanelDetails {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  mentionOnOpen: string[];
  sentMessageID: string;
  namingScheme: string;
  channelID: string;
  message: MessageInfoDetails;
  button: ButtonInfoDetails;
  welcomeMessage: MessageInfoDetails;
  supportTeam: TicketSupportTeamDetails;
  ticketCategory?: string;
}

export interface CreateTicketMultiPanelDto {
  botID: string;
  guildID: string;
  channelID: string;
  message: MessageInfoDetails;
  panelsIDs: string[];
}

export interface UpdateTicketMultiPanelDto {
  channelID?: string;
  message?: MessageInfoDetails;
  panelsIDs?: string[];
  sentMessageID?: string;
}

export interface TicketMultiPanelDetails {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  channelID: string;
  message: MessageInfoDetails;
  panels: TicketPanelDetails[];
  sentMessageID?: string;
}

export interface CreateTicketSupportTeamDto {
  botID: string;
  guildID: string;
  name: string;
  roles: string[];
  users: string[];
}

export interface UpdateTicketSupportTeamDto {
  roles?: string[];
  users?: string[];
}

export interface TicketSupportTeamDetails {
  id: number;
  bot: BotDetails;
  guild: GuildDetails;
  name: string;
  roles: string[];
  users: string[];
}
