'use client';

import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateThaiShort } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  isDisabled?: boolean;
}

export function DatePicker({
  date,
  setDate,
  className,
  placeholder = 'กรุณาเลือกวันที่',
  disabled,
  isDisabled,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={isDisabled}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
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
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      )}

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={
            isDisabled || disabled || ((d) => d < new Date(new Date().setHours(0, 0, 0, 0)))
          }
        />
      </PopoverContent>
    </Popover>
  );
}
