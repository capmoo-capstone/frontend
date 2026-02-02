import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { CancelProjectDialog } from '@/components/project-dialog/cancel-project-dialog';
import { GenerateContractDialog } from '@/components/project-dialog/generate-contract-dialog';
import { useAuth } from '@/context/AuthContext';
import { useProjectWorkflow } from '@/hooks/useProjectWorkflow';
import { useProjectDetail } from '@/hooks/useProjects';
import { ManageUnitRoles, SupervisorRoles } from '@/lib/role-permissions';
import { isActionRequired } from '@/lib/workflow-utils';
import type { FieldConfig } from '@/types/workflow';

import { ProjectHeader } from './components/ProjectHeader';
import { ProjectInfoGrid } from './components/ProjectInfoGrid';
import { DynamicStepForm } from './components/workflow/DynamicStepForm';
import { StatusWaitingCard } from './components/workflow/StatusWaitingCard';
import { StepActionForm } from './components/workflow/StepActionForm';
import { StepHistory } from './components/workflow/StepHistory';
import { WorkflowList } from './components/workflow/WorkflowList';
import { WorkflowStep } from './components/workflow/WorkflowStep';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isGenerateContractDialogOpen, setIsGenerateContractDialogOpen] = useState(false);

  const { data: project, isLoading, isError, error } = useProjectDetail(id);

  const {
    getStepStatus,
    getStepSubmissions,
    getStepFormData,
    getSubmissionFormData,
    handleStepFormChange,
    handleSelectSubmission,
    handleBackToEdit,
    viewingSubmissions,
  } = useProjectWorkflow(project);

  if (!id || !user) return null;
  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (isError) return <div className="p-8 text-center text-red-500">Error: {error?.message}</div>;
  if (!project) return null;

  const convertToFieldConfig = (docs: any[]): FieldConfig[] =>
    docs.map((doc) => ({
      key: doc.field_key,
      label: doc.label,
      type: doc.type,
      required: doc.is_required,
    }));

  const handleConfirmCancel = async () => {
    toast.success('ยกเลิกโครงการสำเร็จ');
    setIsCancelDialogOpen(false);
  };

  const handleExportReport = async () => {
    toast.success('ส่งออกรายงานสำเร็จ');
  };

  const handleGenerateContract = async (contractType: string, year: string) => {
    toast.success(`สร้างเลขที่สัญญาประเภท ${contractType} ปี ${year} สำเร็จ`);
  };

  return (
    <>
      <ProjectHeader
        project={project}
        onCancelProject={() => setIsCancelDialogOpen(true)}
        onExportReport={handleExportReport}
        onGenerateContract={() => setIsGenerateContractDialogOpen(true)}
        viewAsRole={user.role}
      />
      <ProjectInfoGrid project={project} />

      <WorkflowList>
        {project.workflow.steps
          .sort((a, b) => a.order - b.order)
          .map((step) => {
            const status = getStepStatus(step.order);
            const submissions = getStepSubmissions(step.order);
            const viewSubmission = viewingSubmissions[step.order];
            const fields = convertToFieldConfig(step.required_documents);

            const userCanAct = isActionRequired(user.role, status);
            const isCompleted = status === 'completed';
            const showForm = userCanAct || viewSubmission || isCompleted;

            return (
              <WorkflowStep
                key={`step-${step.order}`}
                id={`step-${step.order}`}
                index={step.order}
                viewAsRole={user.role}
                isLast={step.order === project.workflow.steps.length}
                title={step.name}
                status={status}
              >
                <div className="grid grid-cols-1 gap-8 pt-2 lg:grid-cols-12">
                  {/* Left: History */}
                  <div className="lg:col-span-4">
                    <StepHistory
                      submissions={submissions}
                      onSelectSubmission={(sub) => handleSelectSubmission(step.order, sub)}
                      selectedSubmissionId={
                        viewSubmission
                          ? `${step.order}-${viewSubmission.submission_round}`
                          : undefined
                      }
                    />
                  </div>

                  {/* Right: Form OR Status Card */}
                  <div className="lg:col-span-8">
                    {showForm ? (
                      <StepActionForm
                        stepId={`step-${step.order}`}
                        isActive={!viewSubmission && !isCompleted}
                        stepStatus={status}
                        viewAsRole={user.role}
                        viewSubmission={viewSubmission || null}
                        onBackToEdit={() => handleBackToEdit(step.order)}
                        fields={fields}
                      >
                        <DynamicStepForm
                          fields={fields}
                          formData={
                            viewSubmission
                              ? getSubmissionFormData(viewSubmission)
                              : getStepFormData(step.order)
                          }
                          onChange={(key, val) => handleStepFormChange(step.order, key, val)}
                          disabled={
                            isCompleted ||
                            viewSubmission !== undefined ||
                            !userCanAct ||
                            user.role !== 'GENERAL_STAFF'
                          }
                        />
                      </StepActionForm>
                    ) : (
                      <StatusWaitingCard status={status} />
                    )}
                  </div>
                </div>
              </WorkflowStep>
            );
          })}
      </WorkflowList>

      <CancelProjectDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        projectTitle={project.title}
        isAuthorized={ManageUnitRoles.includes(user.role) || SupervisorRoles.includes(user.role)}
      />

      <GenerateContractDialog
        isOpen={isGenerateContractDialogOpen}
        onClose={() => setIsGenerateContractDialogOpen(false)}
        onConfirm={handleGenerateContract}
        projectTitle={project.title}
      />
    </>
  );
}
