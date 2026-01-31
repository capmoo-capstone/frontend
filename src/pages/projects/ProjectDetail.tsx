import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { toast } from 'sonner';

import { CancelProjectDialog } from '@/components/project-dialog/cancel-project-dialog';
import { useAuth } from '@/context/AuthContext';
import { ManageUnitRoles, SupervisorRoles } from '@/lib/role-permissions';

import { ProjectHeader } from './components/ProjectHeader';
import { ProjectInfoGrid } from './components/ProjectInfoGrid';
import { WorkflowList } from './components/workflow/WorkflowList';
import { WorkflowStep } from './components/workflow/WorkflowStep';

export default function ProjectDetail() {
  const { id } = useParams();
  if (!id) return null;

  const { user } = useAuth();
  if (!user) return null;

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const handleConfirmCancel = async (reason: string) => {
    // Implement cancel project logic here
    toast.success('ยกเลิกโครงการสำเร็จ');
    setIsCancelDialogOpen(false);
  };

  const handleExportReport = async () => {
    toast.success('ส่งออกรายงานสำเร็จ');
    // Implement export report logic here
  };

  const steps = [
    {
      id: 'step-1',
      title: 'จัดทำแผนจัดการจัดซื้อจัดจ้าง และจัดทำคำสั่งแต่งตั้งคณะกรรมการฯ TOR',
      status: 'completed',
    },
    {
      id: 'step-2',
      title: 'จัดทำรายงานขอซื้อ/จ้าง, คำสั่งแต่งตั้งคณะกรรมการซื้อ/จ้าง...',
      status: 'completed',
    },
    {
      id: 'step-3',
      title: 'จัดทำรายงานผลการพิจารณาจัดซื้อจัดจ้าง และเสนอผู้มีอำนาจอนุมัติ',
      status: 'active',
    },
    {
      id: 'step-4',
      title: 'จัดทำร่างสัญญา / ใบสั่งซื้อสั่งจ้าง / หนังสือข้อตกลง',
      status: 'pending',
    },
    {
      id: 'step-5',
      title: 'ตรวจรับพัสดุและเบิกจ่ายเงิน',
      status: 'waiting',
    },
    {
      id: 'step-6',
      title: 'รายงานผลการปฏิบัติตามสัญญา',
      status: 'error',
    },
  ];

  return (
    <>
      <ProjectHeader
        onCancelProject={() => setIsCancelDialogOpen(true)}
        onExportReport={handleExportReport}
        viewAsRole={user.role}
      />
      <ProjectInfoGrid />

      <WorkflowList defaultValue="step-1" className="w-full">
        {steps.map((step, idx) => (
          <WorkflowStep
            key={step.id}
            id={step.id}
            index={idx + 1}
            title={step.title}
            status={step.status as any}
            isLast={idx === steps.length - 1}
          >
            <div className="bg-card rounded-md border p-6 shadow-sm">
              <h3 className="mb-4 font-semibold">ข้อมูลประกอบขั้นตอน</h3>
              {/* Insert your StepActionForm here */}
              <div className="bg-muted/20 flex h-32 items-center justify-center rounded border border-dashed">
                Form / Upload Component
              </div>
            </div>
          </WorkflowStep>
        ))}
      </WorkflowList>

      <CancelProjectDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        projectTitle={'project title here'}
        isAuthorized={ManageUnitRoles.includes(user.role) || SupervisorRoles.includes(user.role)}
      />
    </>
  );
}
