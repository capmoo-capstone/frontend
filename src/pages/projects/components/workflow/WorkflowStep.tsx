import * as React from 'react';

import { ChevronDown } from 'lucide-react';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { getStepColor } from '@/lib/workflow-utils';
import type { Role } from '@/types/auth';
import type { StepStatus } from '@/types/project-detail';

interface WorkflowStepProps {
  id: string;
  index: number;
  title: string;
  status?: StepStatus;
  viewAsRole: Role;
  isLast?: boolean;
  isGuest?: boolean;
  children: React.ReactNode;
}

export function WorkflowStep({
  id,
  index,
  title,
  status = 'not_started',
  viewAsRole,
  isLast = false,
  isGuest = false,
  children,
}: WorkflowStepProps) {
  const colors = getStepColor(status, viewAsRole);

  return (
    <AccordionItem value={id} className="relative border-none">
      {/* Connecting Line */}
      {!isLast && (
        <div
          className={cn('absolute top-10 bottom-0 left-4 z-0 w-1 -translate-x-1/2', colors.line)}
        />
      )}

      {/* --- TRIGGER HEADER --- */}
      <AccordionTrigger
        className="group py-4 hover:no-underline disabled:opacity-100 [&>svg]:hidden [&[data-state=open]>div]:rounded-b-none"
        disabled={isGuest}
      >
        <div className={cn('flex w-full items-center gap-4 transition-colors')}>
          {/* Number Bubble */}
          <div
            className={cn(
              'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors',
              colors.bubble
            )}
          >
            {index}
          </div>

          <div
            className={cn(
              'flex w-full items-center gap-4 rounded-lg px-6 py-3 inset-shadow-xs transition-colors',
              colors.container
            )}
          >
            {/* Title Text */}
            <span className="h3-topic flex-1 text-left">{title}</span>

            {/* Chevron Icon */}
            {!isGuest && (
              <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            )}
          </div>
        </div>
      </AccordionTrigger>

      {/* --- CONTENT BODY --- */}
      <AccordionContent className="pb-8">
        <div className="pl-12">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}
