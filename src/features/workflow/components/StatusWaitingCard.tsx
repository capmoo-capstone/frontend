import type { StepStatus } from '@/features/workflow';
import { getWaitingStatusInfo } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface StatusWaitingCardProps {
  status: StepStatus;
}

export function StatusWaitingCard({ status }: StatusWaitingCardProps) {
  const info = getWaitingStatusInfo(status);
  const Icon = info.icon;

  return (
    <div className="animate-in fade-in flex h-full flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center duration-500">
      <div className={cn('rounded-full border-none p-4', info.color)}>
        {Icon && <Icon className="h-8 w-8" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight">{info.title}</h3>
        <p className="text-muted-foreground mx-auto max-w-xs text-sm">{info.description}</p>
      </div>
    </div>
  );
}
