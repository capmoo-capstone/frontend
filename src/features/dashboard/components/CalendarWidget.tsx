import { useState } from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';

import type { UpcomingEvent } from '../types';

interface CalendarWidgetProps {
  upcomingEvents?: UpcomingEvent[];
}

export function CalendarWidget({ upcomingEvents = [] }: CalendarWidgetProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Calendar */}
      <Card className="flex flex-col p-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-full p-0"
          numberOfMonths={2}
        />
      </Card>

      {/* Upcoming Schedule */}
      <Card className="flex-1">
        <CardContent className="flex flex-col gap-3">
          <div className="inline-flex items-start justify-start gap-3">
            <div className="normal-b justify-start text-black">กำหนดการเร็วๆ นี้</div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex flex-1 items-center gap-4">
                  {/* Date Box */}
                  <div className="bg-secondary relative flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md leading-4">
                    <div className="h3-topic">{event.day}</div>
                    <div className="text-primary caption">{event.month}</div>
                  </div>
                  {/* Description */}
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-primary h4-topic">{event.title}</span>
                    <span className="text-muted-foreground caption line-clamp-1">{event.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
