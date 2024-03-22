import { Skeleton } from '@/components/ui/skeleton';
import { useFetchVercelDataCategory } from '@/hooks/vercel/insights';
import type { VercelDataCategories } from '@/types/vercel';
import { Label } from '@radix-ui/react-dropdown-menu';
import React from 'react';
import { flag, name } from 'country-emoji';

const DataBox: React.FC<{
  label: string;
  category: VercelDataCategories;
  fromDateTime: string;
  toDateTime: string;
}> = ({ label, category, fromDateTime, toDateTime }) => {
  const {
    isLoading,
    error,
    data: pathsResponse,
  } = useFetchVercelDataCategory(category, fromDateTime, toDateTime);

  if (isLoading)
    return (
      <div>
        Loading data for {label}...
        <Skeleton className="w-full h-12" />
      </div>
    );

  if (error || !pathsResponse) return <div>Error loading data for {label}</div>;

  return (
    <div
      className={
        'flex flex-col w-full max-h-[300px] md:max-h-[400px] border rounded-lg'
      }
    >
      <div className="px-4 py-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="font-semibold">{label}</Label>
        </div>
        <span className="text-sm uppercase text-foreground/70">Visitors</span>
      </div>
      <div className="overflow-auto px-2">
        <div className="flex flex-col gap-1 py-2">
          {pathsResponse.data.map((data, i) => (
            <div
              key={i}
              className=" rounded-lg px-4 py-1 flex items-center justify-between text-sm gap-8"
            >
              <span className="truncate">
                {displayDataKey(category, data.key)}
              </span>
              <span className="text-foreground/70">{data.devices}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataBox;

/**
 * Displays a data key with additional information based on the category.
 *
 * For the 'country' category, it prepends the country's flag emoji to the country name
 * or code if the flag is available and the name is known. Otherwise, it returns the key as is.
 * @param {VercelDataCategories} category - The category of data, which determines how the key is processed.
 * @param {string} key - The key to be displayed, such as a country code for the 'country' category.
 * @returns {string} The processed key, possibly with additional information like a flag emoji.
 */
function displayDataKey(category: VercelDataCategories, key: string): string {
  if (category === 'country') {
    return `${flag(key) ? `${flag(key)} ` : ``}${name(key) ?? key}`;
  }
  return key;
}
