import React from "react";
import { Label } from "../ui/label";
import DataBox from "./analytics/data-box";
import type { VercelDataCategories } from "@/types/vercel";
import type { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "../ui/date-picker";
import { Button } from "../ui/button";

const VercelData = (): JSX.Element => {
  const dataCategories: Array<{
    label: string;
    category: VercelDataCategories;
  }> = [
    {
      label: "Pages",
      category: "path",
    },
    {
      label: "Referrers",
      category: "referrer",
    },
    {
      label: "Countries",
      category: "country",
    },
    {
      label: "Operating Systems",
      category: "os_name",
    },
    {
      label: "Browers",
      category: "client_name",
    },
  ];
  const today = new Date();

  const [dataDateRange, setDataDateRange] = React.useState<DateRange>({
    from: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
    to: new Date(),
  });

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
    to: new Date(),
  });

  const handleDateRangeChange = (
    selectedRange: DateRange | undefined,
  ): void => {
    setDateRange(selectedRange);
  };

  const handleChangeFetchNewData = (): void => {
    // Assuming you have a function to fetch data based on the selected date range
    // Convert Date objects to ISO string for fetching, if necessary
    if (dateRange) {
      setDataDateRange(dateRange);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Label className="uppercase text-info">Vercel Data</Label>
      <div className="flex items-center gap-2">
        <DatePickerWithRange
          fromDate={dateRange?.from}
          toDate={dateRange?.to}
          onDateRangeChange={handleDateRangeChange}
          fromDateLimit={new Date(2024, 2, 10)}
          toDateLimit={new Date()}
        />
        <Button
          variant={"info"}
          onClick={() => {
            handleChangeFetchNewData();
          }}
        >
          Load data
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {dataCategories.map((dataCategory, i) => (
          <div
            key={i}
            className={`${i < 2 ? "md:col-span-3" : "md:col-span-2"}`}
          >
            <DataBox
              fromDateTime={dataDateRange.from ?? new Date(2024, 2, 10)}
              toDateTime={dataDateRange.to ?? new Date()}
              {...dataCategory}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VercelData;
