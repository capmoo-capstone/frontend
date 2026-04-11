import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface StatusCardProps {
  icon: ReactNode;
  label: string;
  count: number;
  iconColor?: string;
  className?: string;
}

export function StatusCard({ icon, label, count, iconColor, className }: StatusCardProps) {
  return (
    <div className={cn('flex flex-col gap-3 px-4', className)}>
      <div className="flex items-center gap-2">
        <div className={cn('flex h-4 w-4 shrink-0 items-center justify-center', iconColor)}>
          {icon}
        </div>
        <span className="normal wrap-break-words leading-tight">{label}</span>
      </div>
      <span className="text-lg leading-none font-semibold">{count.toLocaleString()}</span>
    </div>
  );
}
