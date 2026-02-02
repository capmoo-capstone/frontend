import { CornerDownRight, FileText } from 'lucide-react';

import { formatDateThai } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import type { Submission } from '@/types/project-detail';

interface StepHistoryProps {
  submissions?: Submission[];
  onSelectSubmission?: (submission: Submission) => void;
  selectedSubmissionId?: string;
}

export function StepHistory({
  submissions,
  onSelectSubmission,
  selectedSubmissionId,
}: StepHistoryProps) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-muted-foreground bg-muted/20 flex h-48 flex-col items-center justify-center rounded-lg border border-dashed">
        <FileText className="mb-2 h-8 w-8 opacity-50" />
        <span className="normal-l">ยังไม่มีประวัติการส่งงาน</span>
      </div>
    );
  }

  return (
    <div className="divide-border flex flex-col divide-y rounded-md border">
      {submissions.map((submission) => {
        const uniqueId = `${submission.step_order}-${submission.submission_round}`;
        const isSelected = selectedSubmissionId === uniqueId;

        return (
          <div
            key={`step-submission-${uniqueId}`}
            onClick={() => onSelectSubmission?.(submission)}
            className={cn(
              'hover:bg-muted/50 relative flex cursor-pointer flex-col gap-2 p-3 transition-colors',
              isSelected && 'border-l-primary bg-muted border-l-4'
            )}
          >
            {/* Header */}
            <div className="flex flex-row items-start justify-between">
              <div className="flex flex-col space-y-1">
                <span className="h4-topic">ส่งครั้งที่ {submission.submission_round}</span>
                <p className="text-muted-foreground caption">
                  โดย {submission.submitted_by || 'ไม่ทราบชื่อ'}
                </p>
              </div>
              <span className="text-muted-foreground caption">
                {formatDateThai(submission.submitted_at, 'd MMM yyyy HH:mm น.')}
              </span>
            </div>

            {/* Feedback */}
            {submission.status === 'REJECTED' && (
              <>
                <hr />
                <div className="flex flex-col items-start gap-1">
                  <div className="flex w-full flex-row items-center justify-between gap-2">
                    <CornerDownRight className="text-primary h-4 w-4" />
                    <span className="h4-topic flex-1">ถูกตีกลับ</span>
                    <span className="text-muted-foreground caption">
                      {formatDateThai(submission.action_at, 'd MMM yyyy HH:mm น.')}
                    </span>
                  </div>
                  <p className="caption ml-6">"{submission.comments}"</p>
                  <p className="text-muted-foreground caption ml-6">
                    โดย {submission.action_by || 'ไม่ทราบชื่อ'}
                  </p>
                </div>
              </>
            )}
            {['ACCEPTED', 'APPROVED'].includes(submission.status) && (
              <>
                <hr />
                <div className="flex flex-col items-start gap-1">
                  <div className="flex w-full flex-row items-center justify-between gap-2">
                    <CornerDownRight className="text-primary h-4 w-4" />
                    <span className="h4-topic flex-1">อนุมัติ</span>
                    <span className="text-muted-foreground caption">
                      {formatDateThai(submission.action_at, 'd MMM yyyy HH:mm น.')}
                    </span>
                  </div>
                  <p className="text-muted-foreground caption ml-6">
                    โดย {submission.action_by || 'ไม่ทราบชื่อ'}
                  </p>
                </div>
              </>
            )}
            {submission.status === 'APPROVED' && (
              <>
                <hr />
                <div className="flex flex-col items-start gap-1">
                  <div className="flex w-full flex-row items-center justify-between gap-2">
                    <CornerDownRight className="text-primary h-4 w-4" />
                    <span className="h4-topic flex-1">ผู้บริหารลงนามฯ</span>
                    <span className="text-muted-foreground caption">
                      {formatDateThai(submission.action_at, 'd MMM yyyy HH:mm น.')}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
