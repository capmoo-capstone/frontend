import { AlertCircle } from 'lucide-react';

import type { User } from '@/types/user';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export function DelegateUser(headUsers: User[]) {
  return (
    <div className="flex flex-col gap-2">
      {headUsers?.map((user) => (
        <div key={user.id} className="flex items-center gap-2">
          <span className="text-normal-normal">{user.full_name}</span>

          {user.is_delegate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-destructive cursor-help">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="rounded-lg border-none bg-black px-3 py-2 text-white">
                  <p className="text-sm">
                    รักษาการแทนในวันที่ {formatDate(user.startDate)} -{' '}
                    {user.endDate ? formatDate(user.endDate) : 'ไม่มีกำหนด'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ))}
    </div>
  );
}
