import { type SiteConfig } from "@/types";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

export const bluetickConfig: SiteConfig = {
  name: "Bluetick",
  description: "- Multi Discord Bots Manager",
  href: "/",
  mainNav: [
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Help",
      href: "https://docs-bluetick.khainguyen.dev/en",
    },
    {
      title: "Discord Support",
      href: "https://discord.gg/sAjhq7SjZg",
    },
  ],
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;
export const BLUETICK_BOT_ID =
  process.env.NEXT_PUBLIC_BOT_ID ?? "1162999806575251557";

export enum ROUTES {
  AUTH = "auth",
  DISCORD = "discord",
  BOTS = "bots",
  USERS = "users",
  GUILDS = "guilds",
  BOTUSERS = "bot-users",
  BOTITEMS = "bot-items",
  BOTGUILDS = "guilds-config",
  BOTGUILDWELCOMES = "guilds-welcomes",

  TICKET_SETTINGS = "ticket/general-settings",
  TICKET_PANELS = "ticket/panels",
  TICKET_SUPPORT_TEAMS = "ticket/support-teams",
  TICKET_MULTI_PANELS = "ticket/multi-panels",
  TICKETS = "ticket/tickets",

  AUTO_RESPONSE = "autoresponse",
  BOT_STAFFS = "bots/staffs",

  DISCORD_BOT = "discord-bots",
  AUTO_ROLES = "auto-roles",

  LOG_SETTING = "log-settings",
  ACTION_LOGS = "action-logs",
}

export enum GUILD_MODULES {
  WELCOME = 2,
  AUTO_RESPONSE = 4,
  TICKET = 8,
  BOOKING = 16,
  GIVEAWAYS = 32,
  AUTO_MESSAGE = 64,
  TWITCH = 128,
  YOUTUBE = 256,
  MESSAGE_EMBEDDER = 512,
  AUTOROLES = 1024,
  ACTION_LOGS = 2048,
}

export const apiInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Authorization: `Web ${API_TOKEN}`,
  },
});

export const API_CONFIG: AxiosRequestConfig = {
  withCredentials: true,
  headers: {
    Authorization: `Web ${API_TOKEN}`,
  },
};
