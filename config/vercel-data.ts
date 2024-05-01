import axios, { type AxiosInstance } from "axios";

const TOKEN = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_DATA ?? "";

export const PROJECT_ID = "prj_NPhEwJDTMx3ODeqkfbjswARJcKPj";

/**
 * There's a way to get the data in JSON by accessing this URL while you're logged or using an
 * HTTP client w/ a Vercel Token in the Authorization header:
 * https://vercel.com/api/web/insights/stats/CATEGORY?environment=production&filter=%7B%7D&from=FROM_DATETIME&limit=250&projectId=PROJECT_ID&teamId=TEAM_ID&to=TO_DATETIME
 * CATEGORY: path, referrer, country, os_name, client_name
 * PROJECT_ID
 * TEAM_ID
 * FROM_DATETIME, TO_DATETIME (eg.): 2023-10-12T00:00:00.000+02:00
 */
export const vercelInsightsInstance: AxiosInstance = axios.create({
  baseURL: "https://vercel.com/api/web/insights/stats/",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});
