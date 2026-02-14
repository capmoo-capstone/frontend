import * as React from 'react';

import { Accordion } from '@/components/ui/accordion';

interface WorkflowListProps {
  children: React.ReactNode;
  defaultValue?: string[];
  className?: string;
}

export function WorkflowList({ children, defaultValue, className }: WorkflowListProps) {
  return (
    <Accordion type="multiple" defaultValue={defaultValue} className={className}>
      {children}
    </Accordion>
  );
}
