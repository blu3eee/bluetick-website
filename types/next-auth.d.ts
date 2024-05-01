import { type DiscordUser } from "./bluetick/discord";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: DiscordUser & { image?: string };
    developerMode?: boolean;
  }
}
