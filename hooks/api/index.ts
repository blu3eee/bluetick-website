// useApiRequest.ts
import { API_URL, apiInstance } from '@/config/bluetick';
import axios, { AxiosInstance } from 'axios';
import { useState } from 'react';

type RequestMethod = 'get' | 'post' | 'patch' | 'delete' | 'put';

type ApiRequestHook = {
  loading: boolean;
  error: any;
  request: (method: RequestMethod, url: string, data?: any) => Promise<any>;
};

const useApiRequest = (): ApiRequestHook => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const request = async (method: RequestMethod, url: string, data = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance[method](url, data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err;
    }
  };

  return { loading, error, request };
};

export default useApiRequest;
