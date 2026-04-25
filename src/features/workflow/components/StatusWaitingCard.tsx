import type { Role } from '@/features/auth';
import type { ProjectStatus } from '@/features/projects';
import { cn } from '@/lib/utils';

import { getWaitingStatusInfo } from '../lib/workflowFormatters';
import { getStepColor } from '../lib/workflow-utils';
import type { StepStatus } from '../types';

interface StatusWaitingCardProps {
  status: StepStatus;
  viewAsRole: Role;
  projectStatus?: ProjectStatus;
  canAct?: boolean;
}

export function StatusWaitingCard({
  status,
  viewAsRole,
  projectStatus,
  canAct,
}: StatusWaitingCardProps) {
  const info = getWaitingStatusInfo(status);
  const Icon = info.icon;
  const colors = getStepColor(status, viewAsRole, projectStatus, canAct);

  return (
    <div
      className={cn(
        'animate-in fade-in flex h-full flex-col items-center justify-center space-y-4 rounded-lg p-8 text-center duration-500',
        colors.container
      )}
    >
      <div className={cn('rounded-full border-none p-4', colors.bubble)}>
        {Icon && <Icon className="h-8 w-8" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight">{info.title}</h3>
        <p className="text-muted-foreground mx-auto max-w-xs text-sm">{info.description}</p>
      </div>
    </div>
  );
}
