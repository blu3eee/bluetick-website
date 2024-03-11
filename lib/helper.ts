import { BLUETICK_BOT_ID } from '@/config/bluetick';
import type { BotAllDetails } from '@/types/bluetick';
import type { DiscordGuild, DiscordUser } from '@/types/bluetick/discord';

const CDN_URL = 'https://cdn.discordapp.com';

export const getGuildIconURL = (guild: DiscordGuild): string =>
  `${CDN_URL}/icons/${guild.id}/${guild.icon}.png`;

export const getGuildIconURL2 = (guildId: string, guildIcon: string): string =>
  `${CDN_URL}/icons/${guildId}/${guildIcon}.png`;

export const getUserAvatarURL = (user: DiscordUser): string =>
  `${CDN_URL}/avatars/${user.id}/${user.avatar}.png?size=4096`;

export const getBotAvatarURL = (bot: BotAllDetails): string =>
  `${CDN_URL}/avatars/${bot.botID ?? BLUETICK_BOT_ID}/${
    bot.avatar
  }.png?size=4096`;

export const getBotInviteURL = (botId: string): string =>
  `https://discord.com/oauth2/authorize?client_id=${botId}&scope=bot%20identify%20guilds%20applications.commands&response_type=code&redirect_uri=https://bluetick.khainguyen.dev/servers&permissions=1513962695871&state=lqR3XUvdsCqAK77wLbjSS`;
