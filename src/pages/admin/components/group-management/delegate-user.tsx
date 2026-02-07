import { AlertCircle } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function DelegateUser() {
  const hasDelegate = true;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="normal">ตัวแทน นามสกุลชั่วคราว</span>

        {hasDelegate && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-destructive">
                  <AlertCircle className="h-5 w-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="text-background rounded-lg border-none bg-black px-3 py-2">
                <p className="text-sm">รักษาการแทนในวันที่</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
