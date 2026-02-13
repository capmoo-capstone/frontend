import * as React from 'react';

import { ArrowLeft, CircleCheckBig, Download, Send, SquareArrowLeft, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Submission } from '@/features/projects';
import type { StepStatus } from '@/features/projects';
import { cn } from '@/lib/utils';
import type { Role } from '@/types/auth';

interface StepActionFormProps {
  isActive?: boolean;
  stepStatus: StepStatus;
  viewAsRole: Role;
  onSubmit?: () => void;
  onReject?: (reason: string) => void;
  onApprove?: () => void;
  onDownloadAll?: () => void;
  onSupApprove?: () => void;
  viewSubmission?: Submission | null;
  onBackToEdit?: () => void;
  children: React.ReactNode;
}

export function StepActionForm({
  isActive = true,
  stepStatus,
  viewAsRole,
  onSubmit,
  onReject,
  onApprove,
  onDownloadAll,
  onSupApprove,
  viewSubmission,
  onBackToEdit,
  children,
}: StepActionFormProps) {
  const [showRejectInput, setShowRejectInput] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');

  const handleRejectClick = () => {
    setShowRejectInput(true);
  };

  const handleCancelReject = () => {
    setShowRejectInput(false);
    setRejectReason('');
  };

  const handleSubmitReject = () => {
    if (rejectReason.trim()) {
      onReject?.(rejectReason);
      setShowRejectInput(false);
      setRejectReason('');
    }
  };

  // --- VIEW MODE ---
  if (viewSubmission) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 flex h-full flex-col duration-300">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center gap-2 border-b pb-4">
          <Button variant="ghost" size="icon" onClick={onBackToEdit} className="size-5">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-primary h3-topic">
              ประวัติการส่งงาน (ครั้งที่ {viewSubmission.submission_round})
            </h3>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-visible">{children}</div>
      </div>
    );
  }

  // --- DEFAULT EDIT MODE ---
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <h3 className="text-primary h3-topic">ข้อมูลประกอบขั้นตอน</h3>
      </div>

      {/* Form Body */}
      <div className={cn('flex-1 space-y-6 overflow-visible', !isActive && 'pointer-events-none')}>
        {children}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 space-y-2 border-t pt-6 empty:hidden">
        {['GENERAL_STAFF'].includes(viewAsRole) &&
          ['in_progress', 'rejected'].includes(stepStatus) && (
            <Button className="w-full" variant="brand" onClick={onSubmit}>
              <Send className="mr-2 h-4 w-4" />
              ส่งงาน
            </Button>
          )}

        {['HEAD_OF_UNIT'].includes(viewAsRole) && ['submitted'].includes(stepStatus) && (
          <>
            {showRejectInput ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="h4-topic">เหตุผลในการส่งกลับ</p>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="กรุณาระบุเหตุผลในการส่งกลับเพื่อแก้ไข..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline" onClick={handleCancelReject}>
                    <X className="mr-2 h-4 w-4" />
                    ยกเลิก
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={handleSubmitReject}
                    disabled={!rejectReason.trim()}
                  >
                    <SquareArrowLeft className="mr-2 h-4 w-4" />
                    ส่งกลับเพื่อแก้ไข
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Button className="w-full" variant="outline" onClick={handleRejectClick}>
                  <SquareArrowLeft className="mr-2 h-4 w-4" />
                  ส่งกลับเพื่อแก้ไข
                </Button>
                <Button className="w-full" variant="brand" onClick={onApprove}>
                  <CircleCheckBig className="mr-2 h-4 w-4" />
                  อนุมัติขั้นตอน
                </Button>
              </>
            )}
          </>
        )}

        {['DOCUMENT_STAFF'].includes(viewAsRole) && ['approved'].includes(stepStatus) && (
          <>
            <Button className="w-full" variant="outline" onClick={onDownloadAll}>
              <Download className="mr-2 h-4 w-4" />
              ดาวน์โหลดเอกสารทั้งหมด
            </Button>
            <Button className="w-full" variant="brand" onClick={onSupApprove}>
              <CircleCheckBig className="mr-2 h-4 w-4" />
              เสนอผู้อำนวยการเรียบร้อยแล้ว
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
