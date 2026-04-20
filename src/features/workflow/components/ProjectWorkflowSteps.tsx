import { useState } from 'react';

import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import {
  type ProjectDetail,
  useAssignProjects,
  useCompleteProjectProcurement,
} from '@/features/projects';
import {
  useCloseProject,
  useCompleteProjectContract,
  useRequestProjectEdit,
} from '@/features/projects/hooks/useProjectMutations';
import { SUPPLY_OPERATION_DEPARTMENT_ID } from '@/features/settings/constants';
import { UserSelect } from '@/features/users';
import { type WorkflowStepConfig, useWorkflow, useWorkflowMutations } from '@/features/workflow';

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
  const [procurementAssigneeId, setProcurementAssigneeId] = useState('');
  const [procurementHandoffCompleted, setProcurementHandoffCompleted] = useState(
    project.current_template_type === 'CONTRACT'
  );
  const [contractHandoffCompleted, setContractHandoffCompleted] = useState(
    project.contract_status === 'COMPLETED' || project.status === 'CLOSED'
  );
  const [showContractEditInput, setShowContractEditInput] = useState(false);
  const [contractEditReason, setContractEditReason] = useState('');

  const workflowState = useWorkflow(project, steps, activeWorkflowType);

  const completeProcurementMutation = useCompleteProjectProcurement();
  const assignProjectsMutation = useAssignProjects();
  const completeContractMutation = useCompleteProjectContract();
  const closeProjectMutation = useCloseProject();
  const requestEditMutation = useRequestProjectEdit();

  const isMutating =
    workflowMutations.createSubmission.isPending ||
    workflowMutations.approveSubmission.isPending ||
    workflowMutations.rejectSubmission.isPending ||
    workflowMutations.proposeSubmission.isPending ||
    workflowMutations.signSubmission.isPending;

  if (!user) return null;

  const hasFinanceRole = user.roles.some((role) => role.role === 'FINANCE_STAFF');

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const lastStepOrder = sortedSteps.at(-1)?.order;

  // Check if all steps are COMPLETED
  const allStepsCompleted = sortedSteps.every((step) => {
    const stepStatus = workflowState.getStepStatus(step.order);
    return stepStatus === 'COMPLETED';
  });

  const isProcurementWorkflow = activeWorkflowType !== 'CONTRACT';
  const isContractWorkflow = activeWorkflowType === 'CONTRACT';

  const isProcurementHandoffBusy =
    completeProcurementMutation.isPending || assignProjectsMutation.isPending;

  const isContractHandoffBusy =
    completeContractMutation.isPending ||
    closeProjectMutation.isPending ||
    requestEditMutation.isPending;

  const canCompleteContract =
    project.status === 'IN_PROGRESS' && project.contract_status === 'NOT_EXPORTED';
  const canCloseProject =
    (project.status === 'IN_PROGRESS' || project.status === 'REQUEST_EDIT') &&
    contractHandoffCompleted;
  const canRequestEdit = project.status === 'CLOSED' && contractHandoffCompleted;

  const handleCompleteProcurementTransfer = async () => {
    if (!user || user.role !== 'HEAD_OF_UNIT' || !allStepsCompleted) return;

    await completeProcurementMutation.mutateAsync(project.id);

    if (procurementAssigneeId) {
      await assignProjectsMutation.mutateAsync([
        {
          projectId: project.id,
          userId: procurementAssigneeId,
        },
      ]);
    }

    setProcurementAssigneeId('');
    setProcurementHandoffCompleted(true);
  };

  const handleCompleteContractTransfer = async () => {
    if (!canCompleteContract) return;

    await completeContractMutation.mutateAsync(project.id);
    setContractHandoffCompleted(true);
  };

  const handleCloseProject = async () => {
    if (!canCloseProject) return;

    await closeProjectMutation.mutateAsync(project.id);
  };

  const handleRequestEdit = async () => {
    const reason = contractEditReason.trim();
    if (!canRequestEdit || !reason) return;

    await requestEditMutation.mutateAsync({ projectId: project.id, reason });
    setShowContractEditInput(false);
    setContractEditReason('');
  };

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

      {isProcurementWorkflow && allStepsCompleted && (
        <div className="mt-6 rounded-lg border p-4">
          {procurementHandoffCompleted ? (
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
                  value={procurementAssigneeId}
                  onChange={setProcurementAssigneeId}
                  unitId={SUPPLY_OPERATION_DEPARTMENT_ID}
                  placeholder="เลือกผู้รับผิดชอบงานบริหารสัญญา"
                  disabled={isProcurementHandoffBusy || user.role !== 'HEAD_OF_UNIT'}
                  className="w-full"
                  excludeHeadOfUnit
                />

                <Button
                  onClick={() => void handleCompleteProcurementTransfer()}
                  disabled={isProcurementHandoffBusy || user.role !== 'HEAD_OF_UNIT'}
                  className="w-full gap-2"
                  variant="brand"
                >
                  {isProcurementHandoffBusy ? (
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

      {isContractWorkflow && allStepsCompleted && hasFinanceRole && (
        <div className="mt-6 rounded-lg border p-4">
          {contractHandoffCompleted ? (
            <>
              <div className="space-y-1 border-b pb-4">
                <h3 className="h4-topic text-primary">ส่งเอกสารเบิกไปยังการเงินเรียบร้อยแล้ว</h3>
                <p className="caption text-muted-foreground">
                  ส่งเอกสารเบิกไปยังการเงินเรียบร้อยแล้ว
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {showContractEditInput ? (
                  <div className="space-y-2">
                    <Textarea
                      value={contractEditReason}
                      onChange={(e) => setContractEditReason(e.target.value)}
                      placeholder="กรุณาระบุเหตุผลการแก้ไข"
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          setShowContractEditInput(false);
                          setContractEditReason('');
                        }}
                        disabled={isContractHandoffBusy}
                      >
                        ยกเลิก
                      </Button>
                      <Button
                        className="flex-1"
                        variant="destructive"
                        onClick={() => void handleRequestEdit()}
                        disabled={
                          isContractHandoffBusy || !canRequestEdit || !contractEditReason.trim()
                        }
                      >
                        ยืนยันส่งแก้ไข
                      </Button>
                    </div>
                  </div>
                ) : canRequestEdit ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setShowContractEditInput(true)}
                    disabled={isContractHandoffBusy}
                  >
                    การเงินส่งคืนแก้ไข
                  </Button>
                ) : canCloseProject ? (
                  <Button
                    className="w-full"
                    variant="brand"
                    onClick={() => void handleCloseProject()}
                    disabled={isContractHandoffBusy}
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
                  onClick={() => void handleCompleteContractTransfer()}
                  disabled={isContractHandoffBusy || !canCompleteContract}
                  className="w-full gap-2"
                  variant="brand"
                >
                  {isContractHandoffBusy ? (
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
