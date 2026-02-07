'use client';

import { useState } from 'react';
import { type DateRange } from 'react-day-picker';

import { addDays, addYears, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function DatePickerWithRange() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  });

  const formatThaiDate = (date: Date) => {
    return format(addYears(date, 543), 'dd/MM/yyyy');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-picker-range"
          className="text-muted-foreground w-full justify-between px-3 font-normal"
        >
          <div className="flex gap-2">
            {date?.from ? (
              date.to ? (
                <>
                  {formatThaiDate(date.from)} - {formatThaiDate(date.to)}
                </>
              ) : (
                formatThaiDate(date.from)
              )
            ) : (
              <span>เลือกวันที่เริ่มต้น - สิ้นสุด</span>
            )}
          </div>
          <CalendarIcon className="text-muted-foreground h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          disabled={(date) => date > new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}
