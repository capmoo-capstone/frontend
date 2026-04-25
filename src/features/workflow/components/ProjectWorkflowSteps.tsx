import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/useAuth';
import { type ProjectDetail } from '@/features/projects';
import { UserSelect } from '@/features/users';
import { CONTRACT_UNIT_ID } from '@/lib/constants';

import { useWorkflow } from '../hooks/useWorkflow';
import { useWorkflowHandoffs } from '../hooks/useWorkflowHandoffs';
import { useWorkflowMutations } from '../hooks/useWorkflowMutations';
import type { WorkflowStepConfig } from '../types';
import { WorkflowList } from './WorkflowList';
import { WorkflowStepRow } from './WorkflowStepRow';

interface ProjectWorkflowStepsProps {
  project: ProjectDetail;
  steps: WorkflowStepConfig[];
  activeWorkflowType: string;
}

export function ProjectWorkflowSteps({
  project,
  steps,
  activeWorkflowType,
}: ProjectWorkflowStepsProps) {
  const { user } = useAuth();
  const workflowMutations = useWorkflowMutations(project.id);

  const workflowState = useWorkflow(project, steps, activeWorkflowType);

  const isMutating =
    workflowMutations.createSubmission.isPending ||
    workflowMutations.approveSubmission.isPending ||
    workflowMutations.rejectSubmission.isPending ||
    workflowMutations.proposeSubmission.isPending ||
    workflowMutations.signSubmission.isPending;

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const lastStepOrder = sortedSteps.at(-1)?.order;
  const handoffs = useWorkflowHandoffs({
    project,
    sortedSteps,
    activeWorkflowType,
    workflowState,
    user,
  });

  if (!user) return null;

  return (
    <>
      <WorkflowList>
        {sortedSteps.map((step) => (
          <WorkflowStepRow
            key={`step-${step.order}`}
            step={step}
            project={project}
            user={user}
            isLast={step.order === lastStepOrder}
            workflowState={workflowState}
            workflowMutations={workflowMutations}
            isMutating={isMutating}
          />
        ))}
      </WorkflowList>

      {handoffs.isProcurementWorkflow && handoffs.allStepsCompleted && (
        <div className="mt-6 rounded-lg border p-4">
          {handoffs.procurementHandoffCompleted ? (
            <div className="space-y-1">
              <h3 className="h4-topic text-primary">ส่งต่องานจัดซื้อไปยังงานบริหารสัญญา</h3>
              <p className="text-muted-foreground normal">
                ส่งต่องานไปยังงานบริหารสัญญาเรียบร้อยแล้ว
              </p>
              {project.assignee_contract.full_name && (
                <p className="caption text-muted-foreground">
                  ผู้รับผิดชอบงานบริหารสัญญา: {project.assignee_contract.full_name}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-1 border-b pb-4">
                <h3 className="h4-topic text-primary">ส่งต่องานจัดซื้อไปยังงานบริหารสัญญา</h3>
                <p className="caption text-muted-foreground">
                  เลือกผู้รับผิดชอบงานบริหารสัญญาได้
                  หรือเว้นว่างไว้เพื่อส่งต่องานโดยไม่กำหนดผู้รับผิดชอบ
                </p>
              </div>

              <div className="mt-4 space-y-4">
                <UserSelect
                  value={handoffs.procurementAssigneeId}
                  onChange={handoffs.setProcurementAssigneeId}
                  unitId={CONTRACT_UNIT_ID}
                  placeholder="เลือกผู้รับผิดชอบงานบริหารสัญญา"
                  disabled={handoffs.isProcurementHandoffBusy || user.role !== 'HEAD_OF_UNIT'}
                  className="w-full"
                  excludeHeadOfUnit
                />

                <Button
                  onClick={() => void handoffs.handleCompleteProcurementTransfer()}
                  disabled={handoffs.isProcurementHandoffBusy || user.role !== 'HEAD_OF_UNIT'}
                  className="w-full gap-2"
                  variant="brand"
                >
                  {handoffs.isProcurementHandoffBusy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      กำลังเปลี่ยน...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      ส่งต่องานจัดซื้อไปยังงานบริหารสัญญา
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {handoffs.isContractWorkflow && handoffs.allStepsCompleted && handoffs.hasFinanceRole && (
        <div className="mt-6 rounded-lg border p-4">
          {handoffs.contractHandoffCompleted ? (
            <>
              <div className="space-y-1 border-b pb-4">
                <h3 className="h4-topic text-primary">ส่งเอกสารเบิกไปยังการเงินเรียบร้อยแล้ว</h3>
                <p className="caption text-muted-foreground">
                  ส่งเอกสารเบิกไปยังการเงินเรียบร้อยแล้ว
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {handoffs.showContractEditInput ? (
                  <div className="space-y-2">
                    <Textarea
                      value={handoffs.contractEditReason}
                      onChange={(e) => handoffs.setContractEditReason(e.target.value)}
                      placeholder="กรุณาระบุเหตุผลการแก้ไข"
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          handoffs.setShowContractEditInput(false);
                          handoffs.setContractEditReason('');
                        }}
                        disabled={handoffs.isContractHandoffBusy}
                      >
                        ยกเลิก
                      </Button>
                      <Button
                        className="flex-1"
                        variant="destructive"
                        onClick={() => void handoffs.handleRequestEdit()}
                        disabled={
                          handoffs.isContractHandoffBusy ||
                          !handoffs.canRequestEdit ||
                          !handoffs.contractEditReason.trim()
                        }
                      >
                        ยืนยันส่งแก้ไข
                      </Button>
                    </div>
                  </div>
                ) : handoffs.canRequestEdit ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handoffs.setShowContractEditInput(true)}
                    disabled={handoffs.isContractHandoffBusy}
                  >
                    การเงินส่งคืนแก้ไข
                  </Button>
                ) : handoffs.canCloseProject ? (
                  <Button
                    className="w-full"
                    variant="brand"
                    onClick={() => void handoffs.handleCloseProject()}
                    disabled={handoffs.isContractHandoffBusy}
                  >
                    ปิดโครงการ
                  </Button>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1 border-b pb-4">
                <h3 className="h4-topic text-primary">บันทึกส่งออกการเงิน</h3>
                <p className="caption text-muted-foreground">
                  บันทึกส่งออกการเงินและส่งต่อไปยังฝ่ายการเงิน
                </p>
              </div>

              <div className="mt-4 space-y-4">
                <Button
                  onClick={() => void handoffs.handleCompleteContractTransfer()}
                  disabled={handoffs.isContractHandoffBusy || !handoffs.canCompleteContract}
                  className="w-full gap-2"
                  variant="brand"
                >
                  {handoffs.isContractHandoffBusy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      บันทึกส่งออกการเงิน
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
