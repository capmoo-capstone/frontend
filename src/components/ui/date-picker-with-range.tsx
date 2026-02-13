'use client';

import { type DateRange } from 'react-day-picker';

import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateThai } from '@/lib/formatters';

interface DatePickerWithRangeProps {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({ value, onChange }: DatePickerWithRangeProps) {
  const formatThaiDate = (date: Date) => {
    return formatDateThai(date, 'dd/MM/yyyy');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-picker-range"
          className="text-muted-foreground normal w-full justify-between px-3 py-2"
        >
          <div className="flex gap-2">
            {value?.from ? (
              value.to ? (
                <>
                  {formatThaiDate(value.from)} - {formatThaiDate(value.to)}
                </>
              ) : (
                formatThaiDate(value.from)
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
          defaultMonth={value?.from}
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          disabled={(date) => date > new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}
