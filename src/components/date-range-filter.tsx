import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
  endOfMonth,
  endOfQuarter,
  endOfYear,
  format,
  isValid,
  parse,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from 'date-fns';
import { th } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateThai } from '@/lib/date-formatters';
import { cn } from '@/lib/utils';

// Helper to format date with Thai Buddhist Era short year
const formatThaiShortYear = (date: Date): string => {
  const dayMonth = format(date, 'dd MMM', { locale: th });
  const yearAD = date.getFullYear();
  const yearBE = yearAD + 543;
  const shortYearBE = String(yearBE).slice(-2);
  return `${dayMonth} ${shortYearBE}`;
};

interface DateRangeFilterProps {
  onDateRangeChange?: (range: DateRange | undefined) => void;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function DateRangeFilter({
  onDateRangeChange,
  className,
  align = 'start',
}: DateRangeFilterProps) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');

  const updateDate = (newRange: DateRange | undefined) => {
    setDate(newRange);
    onDateRangeChange?.(newRange);

    if (newRange?.from) setStartInput(formatDateThai(newRange.from, 'dd/MM/yyyy'));
    else setStartInput('');

    if (newRange?.to) setEndInput(formatDateThai(newRange.to, 'dd/MM/yyyy'));
    else setEndInput('');
  };

  const handlePresetSelect = (preset: string) => {
    const today = new Date();
    let newRange: DateRange | undefined;

    switch (preset) {
      case 'this-fiscal': {
        const currentMonth = today.getMonth();
        const fiscalYear = currentMonth >= 9 ? today.getFullYear() + 1 : today.getFullYear();
        newRange = {
          from: new Date(fiscalYear - 1, 9, 1),
          to: new Date(fiscalYear, 8, 30),
        };
        break;
      }
      case 'this-year':
        newRange = { from: startOfYear(today), to: endOfYear(today) };
        break;
      case 'this-quarter':
        newRange = { from: startOfQuarter(today), to: endOfQuarter(today) };
        break;
      case 'this-month':
        newRange = { from: startOfMonth(today), to: endOfMonth(today) };
        break;
    }
    updateDate(newRange);
  };

  const handleInputChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') setStartInput(value);
    else setEndInput(value);

    // Convert Buddhist Era year to AD year for parsing
    // Input format: dd/MM/yyyy (where yyyy is BE year like 2569)
    let dateStr = value;
    if (value.length === 10) {
      const parts = value.split('/');
      if (parts.length === 3) {
        const yearBE = parseInt(parts[2], 10);
        if (yearBE > 2400) {
          // Convert BE to AD
          const yearAD = yearBE - 543;
          dateStr = `${parts[0]}/${parts[1]}/${yearAD}`;
        }
      }
    }

    const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());

    if (isValid(parsedDate) && value.length === 10) {
      const newRange: DateRange = {
        from: type === 'start' ? parsedDate : date?.from || undefined,
        to: type === 'end' ? parsedDate : date?.to || undefined,
      };

      setDate(newRange);
      onDateRangeChange?.(newRange);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-70 justify-start bg-white text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {formatThaiShortYear(date.from)} - {formatThaiShortYear(date.to)}
                </>
              ) : (
                formatThaiShortYear(date.from)
              )
            ) : (
              <span>เลือกช่วงเวลา (วว/ดด/ปปปป)</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <div className="flex h-55">
            {/* Sidebar Presets */}
            <div className="flex min-w-35 flex-col gap-1 border-r border-slate-100 bg-slate-50/50 p-2">
              <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">ช่วงเวลาด่วน</div>
              <PresetButton
                label="ปีงบประมาณนี้"
                onClick={() => handlePresetSelect('this-fiscal')}
              />
              <PresetButton label="ปีนี้" onClick={() => handlePresetSelect('this-year')} />
              <PresetButton label="ไตรมาสนี้" onClick={() => handlePresetSelect('this-quarter')} />
              <PresetButton label="เดือนนี้" onClick={() => handlePresetSelect('this-month')} />

              <div className="mt-auto border-t border-slate-200 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => updateDate(undefined)}
                >
                  ล้างค่า
                </Button>
              </div>
            </div>

            {/* Right Side: Manual Inputs Only */}
            <div className="flex flex-col justify-center p-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">วันที่เริ่มต้น</Label>
                  <Input
                    className="h-9 w-35"
                    placeholder="DD/MM/YYYY"
                    value={startInput}
                    onChange={(e) => handleInputChange('start', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">วันที่สิ้นสุด</Label>
                  <Input
                    className="h-9 w-35"
                    placeholder="DD/MM/YYYY"
                    value={endInput}
                    onChange={(e) => handleInputChange('end', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-sm font-normal"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
