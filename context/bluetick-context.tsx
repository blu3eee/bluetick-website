'use client';
import React, { createContext, useEffect, useState } from 'react';
import { BotAllDetails } from '@/types/bluetick';
import { API_TOKEN, API_URL, BLUETICK_BOT_ID } from '@/config/bluetick';
import axios from 'axios';

interface BluetickContextValue {
  botDetails: BotAllDetails | null;
  isLoading: boolean;
  error: string | null;
}

export const BluetickContext = createContext<BluetickContextValue>({
  botDetails: null,
  isLoading: false,
  error: null,
});

export const BluetickProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [botDetails, setBotDetails] = useState<BotAllDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBluetickDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.get<{ data: BotAllDetails }>(
        `${API_URL}/discord/bots/${BLUETICK_BOT_ID}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Web ${API_TOKEN}`,
          },
        }
      );

      setBotDetails(data.data);
    } catch (err) {
      console.error('Error fetching Bluetick details:', err);
      setError('Failed to fetch Bluetick details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBluetickDetails();
  }, []);

  return (
    <BluetickContext.Provider value={{ botDetails, isLoading, error }}>
      {children}
    </BluetickContext.Provider>
  );
};
