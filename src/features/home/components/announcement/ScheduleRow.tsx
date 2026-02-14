import type { ScheduleRange } from '../../types';

interface ScheduleRowProps {
  title: string;
  ranges: ScheduleRange[];
  colorClass: string;
}

export function ScheduleRow({ title, ranges, colorClass }: ScheduleRowProps) {
  return (
    <div className="mb-2 flex flex-col items-stretch gap-2 sm:flex-row">
      <div
        className={`flex w-full items-center justify-center rounded-lg p-3 text-center text-sm font-bold text-white sm:w-48 ${colorClass}`}
      >
        {title}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {ranges.map((r, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="flex-1 rounded border bg-slate-50 px-3 py-1.5 text-center font-medium text-slate-700 sm:text-left">
              {r.label}
            </div>
            <div
              className={`w-24 rounded border px-2 py-1.5 text-center text-xs font-bold sm:text-sm ${colorClass.replace('bg-', 'text-').replace('border-', 'border-')} bg-white`}
            >
              {r.end}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
