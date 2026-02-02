import { Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDateThai } from '@/lib/date-utils';
import type { ProjectDetail } from '@/types/project-detail';

interface ProjectInfoGridProps {
  project: ProjectDetail;
}

export const ProjectInfoGrid = ({ project }: ProjectInfoGridProps) => {
  const ProjectInfo: {
    label: string;
    value: string;
    isCopyable?: boolean;
  }[] = [
    { label: 'เลขใบขอซื้อขอจ้าง (PR)', value: project.pr_no || '-', isCopyable: !!project.pr_no },
    {
      label: 'เลขที่รับจาก Lesspaper',
      value: project.less_no || '-',
      isCopyable: !!project.less_no,
    },
    { label: 'วิธีการ', value: project.procurement_type },
    { label: 'วันที่รับเอกสาร', value: formatDateThai(project.created_at, 'd MMM yyyy') },
    {
      label: 'วันครบกำหนดส่งมอบ',
      value: project.expected_approval_date
        ? formatDateThai(project.expected_approval_date, 'd MMM yyyy')
        : '-',
    },
    { label: 'เลขใบสั่งซื้อ (PO)', value: project.po_no || '-', isCopyable: !!project.po_no },
    { label: 'เลขที่ลงรับ', value: project.receive_no || '-', isCopyable: !!project.receive_no },
    {
      label: 'วงเงินงบประมาณ (บาท)',
      value: project.budget
        ? new Intl.NumberFormat('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(project.budget)
        : '-',
    },
    { label: 'หน่วยงาน', value: project.requester.unit_name || '-' },
    { label: 'วันที่ส่งให้ทีมตรวจรับ', value: '-' },
  ];

  const VendorInfo: {
    label: string;
    value: string;
    isCopyable?: boolean;
  }[] = [
    { label: 'ชื่อผู้ขาย/ผู้รับจ้าง', value: project.vendor.name || '-' },
    { label: 'อีเมล', value: project.vendor.email || '-', isCopyable: !!project.vendor.email },
  ];

  return (
    <Card className="space-y-4 p-6">
      <div className="space-y-2">
        <h6 className="text-primary text-h3-topic">รายละเอียดโครงการ</h6>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {ProjectInfo.map((info) => (
            <div key={info.label} className="flex flex-col gap-1">
              <span className="text-muted-foreground text-h4-sub">{info.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-normal-normal">{info.value}</span>
                {info.isCopyable && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => {
                      navigator.clipboard.writeText(info.value);
                    }}
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h6 className="text-primary text-h3-topic">ข้อมูลของผู้ขาย/ผู้รับจ้าง</h6>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {VendorInfo.map((info) => (
            <div key={info.label} className="flex flex-col gap-1">
              <span className="text-muted-foreground text-h4-sub">{info.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-normal-normal">{info.value}</span>
                {info.isCopyable && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => {
                      navigator.clipboard.writeText(info.value);
                    }}
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
