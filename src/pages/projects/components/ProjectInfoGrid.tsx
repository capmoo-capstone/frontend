import { Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const ProjectInfoGrid = () => {
  const ProjectInfo: {
    label: string;
    value: string;
    isCopyable?: boolean;
  }[] = [
    { label: 'เลขใบขอซื้อขอจ้าง (PR)', value: '1234567890', isCopyable: true },
    { label: 'เลขที่รับจาก Lesspaper', value: '1233', isCopyable: true },
    { label: 'วิธีการ', value: 'ซื้อ/จ้าง แบบเจาะจง ไม่เกิน 1 แสน' },
    { label: 'วันที่รับเอกสาร', value: '19 ม.ค. 2569' },
    { label: 'วันครบกำหนดส่งมอบ', value: '30 ม.ค. 2569' },
    { label: 'เลขใบสั่งซื้อ (PO)', value: 'PO123456', isCopyable: true },
    { label: 'เลขที่ลงรับ', value: 'PO123456', isCopyable: true },
    { label: 'วงเงินงบประมาณ (บาท)', value: '2,000,000.00' },
    { label: 'หน่วยงาน', value: 'คณะพาณิชยศาสตร์และการบัญชี' },
    { label: 'วันที่ส่งให้ทีมตรวจรับ', value: '30 ม.ค. 2569' },
  ];

  const VendorInfo: {
    label: string;
    value: string;
    isCopyable?: boolean;
  }[] = [
    { label: 'ชื่อผู้ขาย/ผู้รับจ้าง', value: 'บริษัท หมูกรอบ จำกัด' },
    { label: 'อีเมล', value: 'popoandfriends.co@ppaf.co' },
  ];

  return (
    <Card className="space-y-4 p-6">
      <div className="space-y-2">
        <h6 className="text-primary text-xl font-medium">รายละเอียดโครงการ</h6>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {ProjectInfo.map((info) => (
            <div key={info.label} className="flex flex-col gap-1">
              <span className="text-muted-foreground text-base">{info.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-base">{info.value}</span>
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
        <h6 className="text-primary text-xl font-medium">ข้อมูลของผู้ขาย/ผู้รับจ้าง</h6>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {VendorInfo.map((info) => (
            <div key={info.label} className="flex flex-col gap-1">
              <span className="text-muted-foreground text-base">{info.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-base">{info.value}</span>
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
