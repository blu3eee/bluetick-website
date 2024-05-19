"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useFetchVercelDataCategory } from "@/hooks/vercel/insights";
import { flag } from "country-emoji";
import React from "react";
import { cn } from "@/lib/utils";
import { poppinsFont } from "@/styles/fonts";

const BotCountries = (): JSX.Element => {
  const today = new Date();
  const {
    isLoading,
    error,
    data: dataResponse,
  } = useFetchVercelDataCategory(
    "country",
    new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
    new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  );

  if (isLoading)
    return (
      <div>
        <Skeleton className="h-12 w-full" />
      </div>
    );

  if (error || !dataResponse)
    return <div>Error loading data for countries</div>;

  // Split the data into two arrays
  const firstRowData = dataResponse.data.slice(0, 3);
  const secondRowData = dataResponse.data.slice(3);

  return (
    <div className="flex flex-col items-center justify-center bg-secondary/70 px-2 py-4">
      <span
        className={cn(
          "text-center text-lg font-bold uppercase text-info",
          poppinsFont.className,
        )}
      >
        SPECIAL THANKS TO OUR USERS FROM ALL AROUND THE WORLD
      </span>
      {/* First row */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {firstRowData.map((data) => (
          <span key={data.key} className="text-4xl">
            {flag(data.key) ?? data.key}
          </span>
        ))}
      </div>
      {/* Second row */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {secondRowData.map((data) => (
          <span key={data.key} className="text-4xl">
            {flag(data.key) ?? data.key}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BotCountries;
