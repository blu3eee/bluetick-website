import { DefaultSession } from 'next-auth';
import 'next-auth';
import { UserDetails } from './bluetick/db/user';
import { DiscordUser } from './bluetick/discord';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user?: DiscordUser & { image?: string };
    developerMode?: boolean;
  }
}
