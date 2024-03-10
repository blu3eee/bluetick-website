import type { BotAllDetails } from '@/types/bluetick';
import type { DiscordGuild, DiscordUser } from '@/types/bluetick/discord';

const CDN_URL = 'https://cdn.discordapp.com';

export const getGuildIconURL = (guild: DiscordGuild): string =>
  `${CDN_URL}/icons/${guild.id}/${guild.icon}.png`;

export const getGuildIconURL2 = (guildID: string, guildIcon: string): string =>
  `${CDN_URL}/icons/${guildID}/${guildIcon}.png`;

export const getUserAvatarURL = (user: DiscordUser): string =>
  `${CDN_URL}/avatars/${user.id}/${user.avatar}.png?size=4096`;

export const getBotAvatarURL = (bot: BotAllDetails): string =>
  `${CDN_URL}/avatars/${bot.botID}/${bot.avatar}.png?size=4096`;
