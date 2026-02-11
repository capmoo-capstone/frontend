import { AlertCircle, Briefcase, CheckCircle2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Types
export interface NotificationItem {
  id: number;
  type: 'ASSIGNED' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  title: string;
  description: string;
  time: string;
  isNew?: boolean;
}

const STYLES = {
  ASSIGNED: {
    bg: 'bg-[#fceaef]', // brand-3
    text: 'text-[#de5c8e]', // brand-9
    icon: Briefcase,
  },
  APPROVED: {
    bg: 'bg-[#ccfbf1]', // success-light
    text: 'text-[#14b8a6]', // success
    icon: CheckCircle2,
  },
  COMPLETED: {
    bg: 'bg-[#ccfbf1]', // success-light
    text: 'text-[#14b8a6]', // success
    icon: CheckCircle2,
  },
  REJECTED: {
    bg: 'bg-[#fef3c7]', // warning-light
    text: 'text-[#fbbf24]', // warning
    icon: AlertCircle,
  },
};

export function NotificationList({ notifications }: { notifications: NotificationItem[] }) {
  return (
    <Card className="flex-1">
      <CardContent className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="normal-b">วันนี้</span>
          <span className="text-muted-foreground normal">12 ม.ค. 2569</span>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {notifications.map((item, index) => {
            const style = STYLES[item.type];
            const Icon = style.icon;

            return (
              <div key={item.id} className="flex flex-col gap-4">
                <div className="flex flex-1 items-start gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
                      style.bg
                    )}
                  >
                    <Icon className={cn('h-6 w-6', style.text)} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-primary h4-topic">{item.title}</span>
                      <span className="text-muted-foreground caption">{item.time}</span>
                    </div>
                    <p className="text-primary normal leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Divider */}
                {index !== notifications.length - 1 && <hr className="border-border" />}
              </div>
            );
          })}
        </div>

        {/* Footer Button */}
        <div className="bg-secondary mt-auto flex w-full items-center justify-center rounded py-2">
          <span className="text-primary h4-topic">+ 8 การแจ้งเตือน</span>
        </div>
      </CardContent>
    </Card>
  );
}
