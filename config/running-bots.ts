import axios, { type AxiosInstance } from "axios";
import { API_TOKEN } from "./bluetick";

export const BOTS_API_URL = process.env.NEXT_PUBLIC_DISCORD_BOTS_API_URL;

export const runningBotsInstance: AxiosInstance = axios.create({
  baseURL: BOTS_API_URL,
  withCredentials: true,
  headers: {
    Authorization: `Web ${API_TOKEN}`,
  },
});
