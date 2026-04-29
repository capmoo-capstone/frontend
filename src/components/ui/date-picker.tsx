'use client';

import type { DayPicker } from 'react-day-picker';

import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateThaiShort } from '@/lib/date-formatters';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  disabledDays?: React.ComponentProps<typeof DayPicker>['disabled'];
}

export function DatePicker({
  date,
  setDate,
  className,
  placeholder = 'กรุณาเลือกวันที่',
  disabled = false,
  disabledDays,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-60 justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDateThaiShort(date) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={disabledDays}
            autoFocus
          />
        </PopoverContent>
      )}
    </Popover>
  );
}
