import * as React from 'react';

import { ChevronDown } from 'lucide-react';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface WorkflowStepProps {
  id: string;
  index: number;
  title: string;
  status?: 'pending' | 'active' | 'completed' | 'error' | 'waiting';
  isLast?: boolean;
  children: React.ReactNode;
}

export function WorkflowStep({
  id,
  index,
  title,
  status = 'pending',
  isLast = false,
  children,
}: WorkflowStepProps) {
  return (
    <AccordionItem value={id} className="relative border-none">
      {/* Connecting Line */}
      {!isLast && (
        <div
          className={cn(
            'absolute top-10 bottom-0 left-4 z-0 w-1 -translate-x-1/2',
            status === 'completed'
              ? 'bg-success'
              : status === 'active'
                ? 'bg-primary'
                : status === 'error'
                  ? 'bg-error'
                  : status === 'waiting'
                    ? 'bg-info'
                    : 'bg-warning/50'
          )}
        />
      )}

      {/* --- TRIGGER HEADER --- */}
      <AccordionTrigger className="group py-4 hover:no-underline [&>svg]:hidden [&[data-state=open]>div]:rounded-b-none">
        <div className={cn('flex w-full items-center gap-4 transition-colors')}>
          {/* Number Bubble */}
          <div
            className={cn(
              'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors',
              status === 'completed'
                ? 'bg-success text-white'
                : status === 'active'
                  ? 'bg-primary text-primary-foreground'
                  : status === 'error'
                    ? 'bg-error text-white'
                    : status === 'waiting'
                      ? 'bg-info text-white'
                      : 'bg-warning text-white'
            )}
          >
            {index}
          </div>

          <div
            className={cn(
              'flex w-full items-center gap-4 rounded-lg px-6 py-3 transition-colors',
              status === 'completed'
                ? 'border-success bg-success-light text-success-dark'
                : status === 'active'
                  ? 'border-primary bg-primary/10 text-primary'
                  : status === 'error'
                    ? 'border-error bg-error-light text-error'
                    : status === 'waiting'
                      ? 'border-info bg-info-light text-info'
                      : 'border-warning bg-warning-light text-warning-dark'
            )}
          >
            {/* Title Text */}
            <span className="flex-1 text-left text-lg font-semibold">{title}</span>

            {/* Chevron Icon */}
            <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
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
