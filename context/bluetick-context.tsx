"use client";
import React, { createContext, useEffect, useState } from "react";
import { type BotAllDetails } from "@/types/bluetick";
import { API_TOKEN, API_URL, BLUETICK_BOT_ID } from "@/config/bluetick";
import axios from "axios";

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

/**
 * `BluetickProvider` fetches and provides Bluetick bot details to its children via `BluetickContext`.
 * It manages the state for bot details, loading status, and any potential errors during data fetching.
 * This component should wrap parts of the application that require access to Bluetick bot details.
 * @param {object} props - The props object.
 * @param {React.ReactNode} props.children - The children components that will consume the context.
 * @returns {React.ReactElement} A context provider component that supplies bot details, loading state, and error information to its children.
 */
export const BluetickProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [botDetails, setBotDetails] = useState<BotAllDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBluetickDetails = async (): Promise<void> => {
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
        },
      );

      setBotDetails(data.data);
    } catch (err) {
      console.error("Error fetching Bluetick details:", err);
      setError("Failed to fetch Bluetick details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBluetickDetails().catch((e) => {});
  }, []);

  return (
    <BluetickContext.Provider value={{ botDetails, isLoading, error }}>
      {children}
    </BluetickContext.Provider>
  );
};
