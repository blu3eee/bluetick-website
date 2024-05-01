import { apiInstance } from "@/config/bluetick";
import type { DiscordUser } from "@/types/bluetick/discord";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
const scopes = ["identify", "guilds"].join(" ");

const DISCORD_DEV_ID = process.env.NEXT_PUBLIC_DEV_ID ?? "";
const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID ?? "";
const DISCORD_CLIENT_SECRET =
  process.env.NEXT_PUBLIC_DISCORD_DISCORD_CLIENT_SECRET ?? "";

const AUTH_SECRET =
  process.env.NEXT_PUBLIC_AUTH_SECRET ?? process.env.AUTH_SECRET ?? "asdasd";

const handler = NextAuth({
  secret: AUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: scopes } },
      token: "https://discord.com/api/oauth2/token",
      userinfo: "https://discord.com/api/users/@me",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add the access token to the session
      session.accessToken = String(token.accessToken);
      if (token.profile) {
        session.user = token.profile as DiscordUser & { image?: string };
        session.developerMode =
          (token.profile as DiscordUser & { image?: string }).id ===
          DISCORD_DEV_ID;
      }
      return session;
    },
    async jwt({ token, account, user, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        console.log(token.accessToken);
      }
      if (profile) {
        token.profile = profile;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      // Make an HTTP request to your API backend
      if (account) {
        const res = await apiInstance.post("/auth/logged-in", {
          discordID: account.providerAccountId,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
        });

        // Check if the request was successful
        if (res.status === 200 || res.status === 201) {
          return true; // Returning true allows the sign-in to proceed
        } else {
          return false; // Returning false will deny the sign-in
        }
      } else {
        return false;
      }
    },
  },
});
export { handler as GET, handler as POST };
