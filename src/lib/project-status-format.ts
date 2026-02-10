export const getProjectStatusFormat = (
  project_status: string,
  workflow_status: string,
  procure_status?: string
) => {
  let variant: 'secondary' | 'destructive' | 'warning' | 'success' | 'ghost' = 'secondary';
  let label = workflow_status;

  if (workflow_status.startsWith('IN_PROGRESS')) {
    const stepNumber = workflow_status.split(' ').pop();
    label = `ขั้นตอนที่ ${stepNumber}`;
    variant = 'warning';
  } else if (workflow_status.startsWith('WAITING_APPROVAL')) {
    const stepNumber = workflow_status.split(' ').pop();
    label = `รออนุมัติขั้นตอนที่ ${stepNumber}`;
    variant = 'warning';
  } else if (workflow_status.startsWith('PENDING_PROPOSAL')) {
    const stepNumber = workflow_status.split(' ').pop();
    label = `รอจัดทำแบบเสนอขั้นตอนที่ ${stepNumber}`;
    variant = 'warning';
  } else if (workflow_status.startsWith('PROPOSING')) {
    const stepNumber = workflow_status.split(' ').pop();
    label = `เสนอลงนามขั้นตอนที่ ${stepNumber}`;
    variant = 'warning';
  } else if (workflow_status.startsWith('REJECTED')) {
    const stepNumber = workflow_status.split(' ').pop();
    label = `แก้ไขขั้นตอนที่ ${stepNumber}`;
    variant = 'destructive';
  } else if (workflow_status === 'COMPLETED') {
    label = 'เสร็จสิ้น';
    variant = 'success';
  } else if (workflow_status === 'NOT_STARTED' && project_status === 'IN_PROGRESS') {
    label = '-';
    variant = 'ghost';
  } else {
    switch (project_status) {
      case 'UNASSIGNED':
        if (procure_status === 'NOT_STARTED') {
          label = '-';
          variant = 'ghost';
        } else {
          label = 'ยังไม่ได้มอบหมาย';
          variant = 'secondary';
        }
        break;
      case 'WAITING_ACCEPT':
        if (procure_status === 'NOT_STARTED') {
          label = '-';
          variant = 'ghost';
        } else {
          label = 'รอการตอบรับ';
          variant = 'secondary';
        }
        break;
      case 'CLOSED':
        label = 'เสร็จสิ้น';
        variant = 'success';
        break;
      case 'CANCELLED':
        if (procure_status === 'CANCELLED') {
          label = '-';
          variant = 'ghost';
        } else {
          label = 'ยกเลิก';
          variant = 'destructive';
        }
        break;
      case 'REQUEST_EDIT':
        label = 'การเงินส่งคืนแก้ไข';
        variant = 'destructive';
        break;
      default:
        label = workflow_status;
    }
  }
  return { label, variant };
};
