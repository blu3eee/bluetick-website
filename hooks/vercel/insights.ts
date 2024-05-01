import { type UseQueryResult, useQuery } from "react-query";
import { PROJECT_ID, vercelInsightsInstance } from "@/config/vercel-data";
import { type VercelDataResponse } from "@/types/vercel";
import { formatISO } from "date-fns";

const fetchVercelDataCategory = async (
  category: string,
  fromDateTime: Date,
  toDateTime: Date,
): Promise<VercelDataResponse> => {
  // Encode the date times
  const encodedFromDateTime = encodeURIComponent(formatISO(fromDateTime));
  const encodedToDateTime = encodeURIComponent(formatISO(toDateTime));
  // console.log(encodedFromDateTime, encodedToDateTime);
  const response = await vercelInsightsInstance.get(
    `${category}?environment=production&filter=%7B%7D&from=${encodedFromDateTime}&limit=250&projectId=${PROJECT_ID}&to=${encodedToDateTime}`,
  );
  // console.log(response);
  return response.data;
};

// path, referrer, country, os_name, client_name
export const useFetchVercelDataCategory = (
  category: "path" | "referrer" | "country" | "os_name" | "client_name",
  fromDateTime: Date,
  toDateTime: Date,
): UseQueryResult<VercelDataResponse, unknown> => {
  return useQuery(
    [`fetchVercelData`, category, fromDateTime, toDateTime],
    async () =>
      await fetchVercelDataCategory(category, fromDateTime, toDateTime),
    {
      // Add any options here
      enabled: !!fromDateTime && !!toDateTime, // This ensures the query only runs when botID and guildID are available
    },
  );
};
