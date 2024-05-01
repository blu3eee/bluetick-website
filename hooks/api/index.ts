import { apiInstance } from "@/config/bluetick";
import { useState } from "react";
import type { AxiosResponse } from "axios";

type RequestMethod = "get" | "post" | "patch" | "delete" | "put";

interface ApiRequestHook {
  loading: boolean;
  error: Error | null;
  request: (
    method: RequestMethod,
    url: string,
    data?: Record<string, unknown>,
  ) => Promise<AxiosResponse<unknown>>;
}

const useApiRequest = (): ApiRequestHook => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const request = async (
    method: RequestMethod,
    url: string,
    data: Record<string, unknown> = {},
  ): Promise<AxiosResponse<unknown>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance[method](url, data);
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError(err as Error);
      throw err;
    }
  };

  return { loading, error, request };
};

export default useApiRequest;
