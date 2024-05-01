import axios, { type AxiosInstance } from "axios";
import { API_TOKEN } from "./bluetick";

export const TWITCH_SERVICE_URL = "https://twitch.bluetick.khainguyen.dev";

export const twitchInstance: AxiosInstance = axios.create({
  baseURL: TWITCH_SERVICE_URL,
  withCredentials: true,
  headers: {
    Authorization: `Web ${API_TOKEN}`,
  },
});

export enum TWITCH_ROUTES {
  STREAM_SUBS = "/streams",
}
