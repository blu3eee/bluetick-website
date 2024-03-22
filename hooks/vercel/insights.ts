import { useQuery } from 'react-query';
import { PROJECT_ID, vercelInsightsInstance } from '@/config/vercel-data';
import { VercelDataResponse } from '@/types/vercel';

const fetchVercelDataCategory = async (
  category: string,
  fromDateTime: string,
  toDateTime: string
): Promise<VercelDataResponse> => {
  // Encode the date times
  const encodedFromDateTime = encodeURIComponent(fromDateTime);
  const encodedToDateTime = encodeURIComponent(toDateTime);
  console.log(encodedFromDateTime, encodedToDateTime);
  const response = await vercelInsightsInstance.get(
    `${category}?environment=production&filter=%7B%7D&from=${encodedFromDateTime}&limit=250&projectId=${PROJECT_ID}&to=${encodedToDateTime}`
  );
  return response.data;
};

// path, referrer, country, os_name, client_name
export const useFetchVercelDataCategory = (
  category: 'path' | 'referrer' | 'country' | 'os_name' | 'client_name',
  fromDateTime: string,
  toDateTime: string
) => {
  return useQuery(
    [`fetchVercelData`, category, fromDateTime, toDateTime],
    () => fetchVercelDataCategory(category, fromDateTime, toDateTime),
    {
      // Add any options here
      enabled: !!fromDateTime && !!toDateTime, // This ensures the query only runs when botID and guildID are available
    }
  );
};
