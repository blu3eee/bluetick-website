'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const DatePickerWithRange: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
    fromDate?: Date;
    toDate?: Date;
    onDateRangeChange?: (range: DateRange | undefined) => void;
    fromDateLimit?: Date;
    toDateLimit?: Date;
  }
> = ({
  className,
  fromDate,
  toDate,
  onDateRangeChange,
  fromDateLimit,
  toDateLimit,
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: fromDate ?? new Date(2024, 2, 10),
    to: toDate ?? new Date(2024, 2, 22),
  });

  React.useEffect(() => {
    if (onDateRangeChange) {
      onDateRangeChange(date);
    }
  }, [date, onDateRangeChange]);

  /**
   * Calculates the boundary dates for the calendar selection.
   *
   * If both fromDateLimit and toDateLimit are provided, returns an object
   * with both 'before' and 'after' properties set to these limits.
   * If only one of fromDateLimit or toDateLimit is provided, returns an object
   * with either 'before' or 'after' property set accordingly.
   * Returns undefined if neither fromDateLimit nor toDateLimit is provided.
   * @returns {object|undefined} The boundary dates for the calendar or undefined.
   */
  function boundaries():
    | {
        before: Date;
        after: Date;
      }
    | {
        before: Date;
        after?: undefined;
      }
    | {
        after: Date;
        before?: undefined;
      }
    | undefined {
    if (fromDateLimit && toDateLimit) {
      return {
        before: fromDateLimit,
        after: toDateLimit,
      };
    }
    if (fromDateLimit) {
      return { before: fromDateLimit };
    }
    if (toDateLimit) {
      return { after: toDateLimit };
    }
    return undefined;
  }
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={boundaries()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
