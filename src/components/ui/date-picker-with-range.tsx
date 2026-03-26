'use client';
import { useEffect, useRef, useState } from 'react';
import { type DateRange } from 'react-day-picker';

import { isAfter, isBefore, startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import { formatDateThai } from '@/lib/formatters';

interface DatePickerWithRangeProps {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
}

const MASK = 'วว/ดด/ปปปป';
const FALLBACK = ['ว', 'ว', 'ด', 'ด', 'ป', 'ป', 'ป', 'ป'];

const formatThaiDate = (date: Date) => formatDateThai(date, 'dd/MM/yyyy');

function toArr(masked: string): string[] {
  const chars = masked.replace(/\//g, '');
  const arr: string[] = [];
  for (let i = 0; i < 8; i++) {
    const ch = chars[i] ?? '';
    arr.push(/\d/.test(ch) ? ch : '');
  }
  return arr;
}

function fromArr(arr: string[]): string {
  const get = (i: number) => (arr[i] !== '' ? arr[i] : FALLBACK[i]);
  return `${get(0)}${get(1)}/${get(2)}${get(3)}/${get(4)}${get(5)}${get(6)}${get(7)}`;
}
function parseDate(masked: string): Date | null {
  if (/[วดป]/.test(masked)) return null;

  const parts = masked.split('/');
  if (parts.length !== 3) return null;

  const [dd, mm, yyyy] = parts;
  if (yyyy.length !== 4) return null;

  const day = parseInt(dd, 10);
  const month = parseInt(mm, 10);
  const yearBE = parseInt(yyyy, 10);
  const yearAD = yearBE - 543;

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (yearAD < 1) return null;

  const parsed = new Date(yearAD, month - 1, day);
  if (isNaN(parsed.getTime())) return null;

  if (
    parsed.getFullYear() !== yearAD ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

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
  onValidDate: (date: Date) => string | null,
  onFocusOpen: () => void
) {
  const [masked, setMasked] = useState(initial || MASK);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial) {
      setMasked(initial);
      setError(null);
    } else {
      setMasked(MASK);
    }
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

    const cursorPos = el.selectionStart ?? 0;
    const arr = toArr(masked);

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
      arr[target] = '';
      setMasked(fromArr(arr));
      setError(null);
      setCursor(digitIndexToCursorPos(target));
      return;
    }

    if (e.key === 'Delete') {
      const effectivePos = snapCursor(cursorPos);
      const dIdx = cursorPosToDigitIndex(effectivePos);
      if (dIdx > 7) return;
      arr[dIdx] = '';
      setMasked(fromArr(arr));
      setError(null);
      setCursor(effectivePos);
      return;
    }

    if (/^\d$/.test(e.key)) {
      const effectivePos = snapCursor(cursorPos);
      const dIdx = cursorPosToDigitIndex(effectivePos);
      if (dIdx > 7) return;
      arr[dIdx] = e.key;
      const newMasked = fromArr(arr);
      setMasked(newMasked);

      const nextPos = effectivePos + 1;
      const snappedNext = nextPos === 2 ? 3 : nextPos === 5 ? 6 : nextPos;
      setCursor(Math.min(10, snappedNext));

      const date = parseDate(newMasked);
      if (date) {
        const validationError = onValidDate(date);
        setError(validationError);
      }
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

  const isEmpty = masked === MASK && !focused;

  return {
    inputRef,
    masked,
    setMasked,
    focused,
    isEmpty,
    error,
    setError,
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
    (date): string | null => {
      const today = startOfDay(new Date());
      if (date > today) return 'ไม่สามารถเลือกวันในอนาคตได้';
      const range = internalRange;
      if (range?.to && isAfter(date, range.to))
        return 'วันเริ่มต้นต้องอยู่ก่อนหรือเป็นวันเดียวกับวันสิ้นสุด';
      setInternalRange({ from: date, to: range?.to });
      onChange?.({ from: date, to: range?.to });
      setCurrentMonth(date);
      return null;
    },
    () => setOpen(true)
  );

  const toInput = useMaskedDateInput(
    toStr,
    (date): string | null => {
      const today = startOfDay(new Date());
      if (date > today) return 'ไม่สามารถเลือกวันในอนาคตได้';
      const range = internalRange;
      if (range?.from && isBefore(date, range.from)) {
        return 'วันสิ้นสุดต้องอยู่หลังหรือเป็นวันเดียวกับวันเริ่มต้น';
      }
      setInternalRange({ from: range?.from, to: date });
      onChange?.({ from: range?.from, to: date });
      return null;
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
      fromInput.setError(null);

      toInput.setMasked(MASK);
      toInput.setError(null);

      setStep(2);
      setTimeout(() => toInput.inputRef.current?.focus(), 0);
    } else {
      const startDate = internalRange?.from;

      let newRange: DateRange;

      if (!startDate) {
        newRange = { from: day, to: day };
      } else if (isBefore(day, startDate)) {
        newRange = { from: day, to: startDate };
      } else {
        newRange = { from: startDate, to: day };
      }

      setInternalRange(newRange);
      onChange?.(newRange);

      fromInput.setMasked(formatThaiDate(newRange.from!));
      toInput.setMasked(formatThaiDate(newRange.to!));

      fromInput.setError(null);
      toInput.setError(null);

      setOpen(false);
      setStep(1);
    }
  };

  return (
    <div ref={containerRef} className="bg-background relative w-68">
      <div
        className={`focus-within:ring-primary hover:bg-accent/50 relative flex h-9 cursor-text items-center rounded-md border px-3 shadow-xs ${
          fromInput.error || toInput.error ? 'border-destructive focus-within:ring-destructive' : ''
        }`}
      >
        <CalendarIcon className="text-muted-foreground mr-2 h-4 w-4 shrink-0" />

        {/* Start */}
        <div className="relative flex flex-1 flex-col">
          {fromInput.isEmpty && (
            <span className="text-muted-foreground normal-normal pointer-events-none absolute inset-0 flex items-center">
              เลือกวันที่เริ่มต้น
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
            className="normal-normal w-full cursor-text bg-transparent font-mono outline-none"
          />
        </div>

        <span className="text-muted-foreground ml-1 self-center">-</span>

        {/* End */}
        <div className="relative ml-2 flex flex-1 flex-col">
          {toInput.isEmpty && (
            <span className="text-muted-foreground normal-normal pointer-events-none absolute inset-0 flex items-center">
              สิ้นสุด
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
            className="normal-normal w-full cursor-text bg-transparent font-mono outline-none"
          />
        </div>
      </div>

      {(fromInput.error || toInput.error) && (
        <p className="text-destructive mt-1 text-xs">{fromInput.error ?? toInput.error}</p>
      )}

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
            onDayClick={(day, modifiers) => {
              if (modifiers.disabled) return;
              handleDayClick(day);
            }}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
            initialFocus={false}
          />
        </div>
      )}
    </div>
  );
}
