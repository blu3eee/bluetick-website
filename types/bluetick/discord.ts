// eslint-disable @typescript-eslint/no-explicit-any
import { type EmbedDetails } from ".";

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  avatar: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string;
  accent_color?: number;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags: number;
  premium_type: number;
  public_flags: number;
  avatar_decoration?: string;
}

export interface DiscordGuildMember {
  user: DiscordUser;
  nick?: string;
  avatar?: string;
  roles: string[];
  joined_at: Date;
  premium_since?: Date;
  deaf: boolean;
  mute: boolean;
  pending?: boolean;
  permissions: string;
}

export interface PartialMember {
  avatar?: string;
  flags: number;
  nick?: string;
  pending?: boolean;
  roles: string[];
  user?: DiscordUser;
  mute: boolean;
  beaf: boolean;
  permissions?: string;
}

export interface DiscordPartialGuildChannel {
  id: string;
  default_thread_rate_limit_per_user?: number;
  last_message_id: string;
  type: number;
  name: string;
  position: number;
  parent_id?: string;
  topic?: string;
  guild_id: string;
  permission_overwrites: string[];
  nsfw: boolean;
  rate_limit_per_user: string;
  banner?: string;
  flags?: number;
}

export interface DiscordChannel {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: string[];
  name?: string;
  topic?: string;
  nsfw?: boolean;
  last_message_id: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: string;
  recipients?: DiscordUser[];
  icon?: string;
  owner_id?: string;
  application_id?: string;
  managed?: boolean;
  parent_id?: string;
  member_count?: string;
  member?: DiscordGuildMember;
  default_auto_archive_duration?: number;
  permissions?: string;
  flags?: number;
  total_message_sent?: number;
  default_thread_rate_limit_per_user?: number;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string | null;
  unicode_emoji?: string | null;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags?: {
    bot_id?: string;
  };
  flags: number;
}

export interface DiscordPartialEmoji {
  id: string;
  name: string;
  roles: string[];
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string;
  permissions: string;
  icon_hash?: string;
  description: string;
  home_header: string;
  splash: string;
  discovery_splash: string;
  approximate_member_count: number;
  approximate_presence_count: number;
  owner_id: string;
  region?: string;
  afk_channel_id: string;
  afk_timeout: number;
  widget_enabled?: boolean;
  widget_channel_id?: string;
  verification_level: number;
  default_message_notifications: number;
  explicit_content_filter: number;
  roles: DiscordRole[];
  emojis: DiscordPartialEmoji[];
  features: string[];
  mfa_level: number;
  application_id: string;
  system_channel_id: string;
  system_channel_flags: number;
  rules_channel_id: string;
  max_presences?: number;
  max_members?: number;
  vanity_url_code: string;
  banner: string;
  premium_tier: number;
  premium_subscription_count: number;
  preferred_locale: string;
  public_updates_channel_id: string;
  max_video_channel_users: number;
  welcome_screen: string;
  nsfw_level: number;
  stickers?: string[];
  premium_progress_bar_enabled: boolean;
}

export interface DiscordMessage {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: DiscordUser;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: DiscordUser[];
  mention_roles: string[];
  mention_channels?: ChannelMention[];
  attachments: Attachment[];
  embeds: EmbedDetails[];
  reactions?: Reaction[];
  nonce?: string | number;
  pinned: boolean;
  webhook_id?: string;
  type: number;
  activity?: MessageActivity;
  application?: MessageApplication;
  message_reference?: MessageReference;
  flags?: number;
  referenced_message?: DiscordMessage | null;
  interaction?: MessageInteraction;
  components?: MessageComponent[];
}

export interface DiscordMessageUpdateDto {
  content?: string;
  embeds?: EmbedDetails[];
  flags?: number;
  components?: MessageComponent[];
  files?: Attachment[];
}

export interface ChannelMention {
  id: string;
  guild_id: string;
  type: number;
  name: string;
}

export interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number;
  width?: number;
}

export interface Reaction {
  count: number;
  me: boolean;
  emoji: DiscordPartialEmoji;
}

export interface MessageActivity {
  type: number;
  party_id?: string;
}

export interface MessageApplication {
  id: string;
  cover_image?: string;
  description: string;
  icon: string | null;
  name: string;
}

export interface MessageReference {
  message_id?: string;
  channel_id: string;
  guild_id?: string;
  fail_if_not_exists?: boolean;
}

export interface MessageInteraction {
  id: string;
  type: number;
  name: string;
  user: DiscordUser;
}

export interface MessageComponent {
  type: number;
  style?: number;
  label?: string;
  emoji?: DiscordPartialEmoji;
  custom_id?: string;
  url?: string;
  disabled?: boolean;
  components?: MessageComponent[];
}

// * This is always present on application command, message component, and modal submit interaction types. It is optional for future-proofing against new interaction types
// ** member is sent when the interaction is invoked in a guild, and user is sent when invoked in a DM

export interface DiscordInteraction {
  id: string;
  type: number;
  // data?: any; // *
  guild_id?: string;
  channel?: DiscordPartialGuildChannel;
  channel_id: string;
  member?: DiscordGuildMember; // **
  token: string;
  version: number;
  message?: DiscordMessage; // Optional based on interaction type
  app_permission?: string;
  locale?: string; // ***
  guild_locale?: string;
}

export interface InteractionResponseData {
  tts?: boolean;
  content?: string;
  embeds?: Array<{
    title?: string;
    type?: string;
    description?: string;
    url?: string;
    timestamp?: Date;
    color?: number | string;
    footer?: { text: string; icon_url?: string; proxy_icon_url?: string };
    image?: {
      url: string;
      proxy_url?: string;
      height?: number;
      weight?: number;
    };
    thumbnail?: {
      url: string;
      proxy_url?: string;
      height?: number;
      weight?: number;
    };
    video?: {
      url: string;
      proxy_url?: string;
      height?: number;
      weight?: number;
    };
    provider?: { name?: string; url: string };
    author?: {
      name: string;
      icon_url?: string;
      url?: string;
      proxy_icon_url?: string;
    };
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
  }>;
  flags?: number;
  components?: MessageComponent[];
}

export interface DiscordPartialInteraction {
  id: string;
  token: string;
  userID?: string;
}

export interface DiscordUpdateChannelParams {
  name?: string;
}

export enum CHANNEL_TYPE {
  ANNOUNCEMENT_THREAD = "10",
  PUBLIC_THREAD = "11",
  PRIVATE_THREAD = "12",
}

export enum DISCORD_BUTTON_STYLES {
  BLURPLE = "Blurple",
  GREY = "Grey",
  GREEN = "Green",
  RED = "Red",
  GREY_LINK = "Link",
}

export enum DISCORD_PERMISSIONS {
  ADMINISTRATOR = 1 << 3,
}
