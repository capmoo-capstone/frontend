'use client';
import { useEffect, useRef, useState } from 'react';
import { type DateRange } from 'react-day-picker';

import { isBefore, isValid, parse, startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import { formatDateThai } from '@/lib/formatters';

interface DatePickerWithRangeProps {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
}

const MASK = 'วว/ดด/ปปปป';

const formatThaiDate = (date: Date) => formatDateThai(date, 'dd/MM/yyyy');

function applyMask(digits: string): string {
  const d = digits.padEnd(8, '');
  const get = (i: number, fallback: string) =>
    d[i] !== undefined && d[i] !== '' ? d[i] : fallback;
  return `${get(0, 'ว')}${get(1, 'ว')}/${get(2, 'ด')}${get(3, 'ด')}/${get(4, 'ป')}${get(5, 'ป')}${get(6, 'ป')}${get(7, 'ป')}`;
}

function extractDigits(masked: string): string {
  return masked.replace(/[^0-9]/g, '');
}

function parseDate(masked: string): Date | null {
  if (/[วดป]/.test(masked)) return null;
  // masked = dd/MM/yyyy (พ.ศ.) เช่น 25/03/2568
  const parts = masked.split('/');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  if (yyyy.length !== 4) return null;

  const yearBE = parseInt(yyyy, 10);
  const yearAD = yearBE - 543; // แปลง พ.ศ. → ค.ศ.

  const parsed = new Date(yearAD, parseInt(mm, 10) - 1, parseInt(dd, 10));
  if (isNaN(parsed.getTime())) return null;
  return startOfDay(parsed);
}

function digitIndexToCursorPos(digitIndex: number): number {
  if (digitIndex <= 2) return digitIndex;
  if (digitIndex <= 4) return digitIndex + 1;
  return digitIndex + 2;
}

function cursorPosToDigitIndex(cursorPos: number): number {
  if (cursorPos <= 2) return cursorPos;
  if (cursorPos <= 5) return cursorPos - 1;
  return cursorPos - 2;
}

function snapCursor(pos: number): number {
  if (pos === 2) return 3;
  if (pos === 5) return 6;
  return pos;
}

function useMaskedDateInput(
  initial: string,
  onValidDate: (date: Date) => void,
  onFocusOpen: () => void
) {
  const [masked, setMasked] = useState(initial || MASK);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMasked(initial || MASK);
  }, [initial]);

  const setCursor = (pos: number) => {
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(pos, pos);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = inputRef.current;
    if (!el) return;
    if (e.key === 'Tab') return;
    e.preventDefault();

    const rawPos = el.selectionStart ?? 0;
    const cursorPos = rawPos;
    const digits = extractDigits(masked);

    if (e.key === 'ArrowLeft') {
      const prevRaw = cursorPos - 1;
      const next = prevRaw === 2 ? 2 : prevRaw === 5 ? 5 : prevRaw;
      setCursor(Math.max(0, next));
      return;
    }

    if (e.key === 'ArrowRight') {
      const nextRaw = cursorPos + 1;
      const next = nextRaw === 2 ? 3 : nextRaw === 5 ? 6 : nextRaw;
      setCursor(Math.min(10, next));
      return;
    }

    if (e.key === 'Backspace') {
      const effectivePos = cursorPos === 3 ? 2 : cursorPos === 6 ? 5 : cursorPos;
      const dIdx = cursorPosToDigitIndex(effectivePos);
      const target = dIdx - 1;
      if (target < 0) return;
      const newDigits = digits.slice(0, target) + digits.slice(target + 1);
      setMasked(applyMask(newDigits));
      setCursor(digitIndexToCursorPos(target));
      return;
    }

    if (e.key === 'Delete') {
      const effectivePos = snapCursor(cursorPos);
      const dIdx = cursorPosToDigitIndex(effectivePos);
      if (dIdx > 7) return;
      const newDigits = digits.slice(0, dIdx) + digits.slice(dIdx + 1);
      setMasked(applyMask(newDigits));
      setCursor(effectivePos);
      return;
    }

    if (/^\d$/.test(e.key)) {
      const effectivePos = snapCursor(cursorPos);
      const dIdx = cursorPosToDigitIndex(effectivePos);
      if (dIdx > 7) return;
      const newDigits = digits.slice(0, dIdx) + e.key + digits.slice(dIdx + 1);
      const newMasked = applyMask(newDigits);
      setMasked(newMasked);

      const nextPos = effectivePos + 1;
      const snappedNext = nextPos === 2 ? 3 : nextPos === 5 ? 6 : nextPos;
      setCursor(Math.min(10, snappedNext));

      const date = parseDate(newMasked);
      if (date) onValidDate(date);
      return;
    }
  };

  const handleClick = () => {
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      const pos = el.selectionStart ?? 0;
      const snapped = snapCursor(pos);
      if (snapped !== pos) setCursor(snapped);
    });
  };

  const handleFocus = () => {
    setFocused(true);
    onFocusOpen();
    setCursor(0);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const isEmpty = /[วดป]/.test(masked) && !focused;

  return {
    inputRef,
    masked,
    setMasked,
    focused,
    isEmpty,
    handleKeyDown,
    handleClick,
    handleFocus,
    handleBlur,
  };
}

export function DatePickerWithRange({ value, onChange }: DatePickerWithRangeProps) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [step, setStep] = useState<1 | 2>(1);
  const [internalRange, setInternalRange] = useState<DateRange | undefined>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const fromStr = value?.from ? formatThaiDate(value.from) : '';
  const toStr = value?.to ? formatThaiDate(value.to) : '';

  const fromInput = useMaskedDateInput(
    fromStr,
    (date) => {
      const newRange: DateRange = { from: date, to: internalRange?.to };
      setInternalRange(newRange);
      onChange?.(newRange);
      setCurrentMonth(date);
    },
    () => setOpen(true)
  );

  const toInput = useMaskedDateInput(
    toStr,
    (date) => {
      const newRange: DateRange = { from: internalRange?.from, to: date };
      setInternalRange(newRange);
      onChange?.(newRange);
    },
    () => setOpen(true)
  );

  useEffect(() => {
    if (open) {
      setStep(1);
      setInternalRange(value);
    }
  }, [open]);

  useEffect(() => {
    if (value?.from && !open) setCurrentMonth(value.from);
  }, [value, open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDayClick = (selectedDay: Date) => {
    const day = startOfDay(selectedDay);
    if (step === 1) {
      const newRange: DateRange = { from: day, to: undefined };
      setInternalRange(newRange);
      onChange?.(newRange);
      fromInput.setMasked(formatThaiDate(day));
      toInput.setMasked(MASK);
      setStep(2);
      setTimeout(() => toInput.inputRef.current?.focus(), 0);
    } else {
      const startDate = internalRange?.from;
      let newRange: DateRange;
      if (startDate && isBefore(day, startDate)) {
        newRange = { from: day, to: startDate };
      } else {
        newRange = { from: startDate, to: day };
      }
      setInternalRange(newRange);
      onChange?.(newRange);
      fromInput.setMasked(newRange.from ? formatThaiDate(newRange.from) : MASK);
      toInput.setMasked(newRange.to ? formatThaiDate(newRange.to) : MASK);
      setOpen(false);
      setStep(1);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="focus-within:ring-primary hover:bg-accent/50 relative flex w-full cursor-text items-center gap-2 rounded-md border px-3 py-2 shadow-sm transition-colors focus-within:ring-2">
        <CalendarIcon className="text-muted-foreground h-4 w-4 shrink-0" />

        {/* Start */}
        <div className="relative flex flex-1 flex-col">
          {fromInput.isEmpty && (
            <span className="text-muted-foreground pointer-events-none absolute inset-0 flex items-center font-mono text-sm">
              วันที่เริ่มต้น
            </span>
          )}
          <input
            ref={fromInput.inputRef}
            value={fromInput.isEmpty ? '' : fromInput.masked}
            onKeyDown={fromInput.handleKeyDown}
            onClick={fromInput.handleClick}
            onFocus={fromInput.handleFocus}
            onBlur={fromInput.handleBlur}
            onChange={() => {}}
            inputMode="numeric"
            className="w-full cursor-text bg-transparent font-mono text-sm outline-none"
          />
        </div>

        <span className="text-muted-foreground self-center">-</span>

        {/* End */}
        <div className="relative flex flex-1 flex-col">
          {toInput.isEmpty && (
            <span className="text-muted-foreground pointer-events-none absolute inset-0 flex items-center font-mono text-sm">
              วันที่สิ้นสุด
            </span>
          )}
          <input
            ref={toInput.inputRef}
            value={toInput.isEmpty ? '' : toInput.masked}
            onKeyDown={toInput.handleKeyDown}
            onClick={toInput.handleClick}
            onFocus={toInput.handleFocus}
            onBlur={toInput.handleBlur}
            onChange={() => {}}
            inputMode="numeric"
            className="w-full cursor-text bg-transparent font-mono text-sm outline-none"
          />
        </div>
      </div>

      {open && (
        <div className="bg-popover text-popover-foreground absolute top-full left-0 z-50 mt-1 rounded-md border shadow-md">
          <Calendar
            mode="single"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            selected={internalRange?.from}
            modifiers={{
              range_start: internalRange?.from ? [internalRange.from] : [],
              range_end: internalRange?.to ? [internalRange.to] : [],
              range_middle:
                internalRange?.from && internalRange?.to
                  ? [{ from: internalRange.from, to: internalRange.to }]
                  : [],
            }}
            modifiersClassNames={{
              range_start: 'rdp-day_range_start',
              range_end: 'rdp-day_range_end',
              range_middle: 'rdp-day_range_middle',
            }}
            onSelect={(day) => day && handleDayClick(day)}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
            initialFocus={false}
          />
        </div>
      )}
    </div>
  );
}
