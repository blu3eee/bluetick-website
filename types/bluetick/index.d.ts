import { BotDetails } from './db/bot';
import { DiscordUser } from './discord';

export type BotAllDetails = DiscordUser & BotDetails;

export interface ButtonInfoDetails {
  color: string;
  text: string;
  emoji: string;
  customID?: string;
  url?: string;
}

export interface DiscordApiButtonDetails {
  color: string;
  text: string;
  emoji?: PartialEmoji;
  customID?: string;
}

export interface PartialEmoji {
  id: string | null;
  name: string;
  animated?: boolean;
}

export interface MessageInfoDetails {
  type?: string;
  content?: string;
  embed?: EmbedDetails;
}

export interface EmbedDetails {
  description?: string;
  message?: string;
  color?: string;
  title?: string;
  url?: string;
  author?: string;
  authorURL?: string;
  image?: string;
  thumbnail?: string;
  footer?: string;
  footerURL?: string;
  fields?: EmbedFieldDetails[];
  timestamp?: boolean;
}

export interface EmbedFieldDetails {
  name: string;
  value: string;
  inline?: boolean;
}

export type Done = (err: Error, user: UserInfo) => void;
