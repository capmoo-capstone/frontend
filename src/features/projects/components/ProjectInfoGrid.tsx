import { useEffect, useMemo, useState } from 'react';

import { Check, ChevronDown, Copy, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useBudgetPlans } from '@/features/budgets';
import { formatDateThai, getFiscalYear } from '@/lib/formatters';
import { cn } from '@/lib/utils';

import type { ProjectDetail } from '../types/index';

interface ProjectInfoGridProps {
  project: ProjectDetail;
  canEditProjectDetails?: boolean;
  onSaveVendorInfo?: (data: { vendor_name: string; vendor_email: string }) => Promise<void>;
  isSavingVendorInfo?: boolean;
}

const formatNumberThai = (value: number | null) => {
  if (!value) {
    return '-';
  }

  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

interface ReadonlyFieldCellProps {
  label: string;
  value: string;
  isCopyable?: boolean;
}

const ReadonlyFieldCell = ({ label, value, isCopyable = false }: ReadonlyFieldCellProps) => (
  <div className="flex min-h-14 flex-col gap-1">
    <span className="text-muted-foreground h4-sub">{label}</span>
    <div className="flex items-center gap-2">
      <span className="normal">{value}</span>
      {isCopyable && value !== '-' && (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary h-6 w-6 p-0 hover:bg-transparent"
          onClick={() => {
            navigator.clipboard.writeText(value);
          }}
        >
          <Copy className="h-5 w-5" />
        </Button>
      )}
    </div>
  </div>
);

export const ProjectInfoGrid = ({
  project,
  canEditProjectDetails = false,
  onSaveVendorInfo,
  isSavingVendorInfo = false,
}: ProjectInfoGridProps) => {
  const [isEditingProjectInfo, setIsEditingProjectInfo] = useState(false);
  const [isEditingVendor, setIsEditingVendor] = useState(false);

  const [hasAssetCode, setHasAssetCode] = useState((project.budget_plan_id?.length ?? 0) > 0);
  const [selectedBudgetPlanIds, setSelectedBudgetPlanIds] = useState<string[]>(
    project.budget_plan_id ?? []
  );

  const [vendorName, setVendorName] = useState(project.vendor.name ?? '');
  const [vendorEmail, setVendorEmail] = useState(project.vendor.email ?? '');

  const fiscalYear = String(getFiscalYear(project.created_at));
  const { data: budgetPlans, isLoading: isLoadingBudgetPlans } = useBudgetPlans(
    project.requester.unit_id ?? '',
    fiscalYear
  );

  useEffect(() => {
    setHasAssetCode((project.budget_plan_id?.length ?? 0) > 0);
    setSelectedBudgetPlanIds(project.budget_plan_id ?? []);
    setVendorName(project.vendor.name ?? '');
    setVendorEmail(project.vendor.email ?? '');
    setIsEditingProjectInfo(false);
    setIsEditingVendor(false);
  }, [project.id, project.budget_plan_id, project.vendor.email, project.vendor.name]);

  const selectedBudgetPlans = useMemo(
    () => budgetPlans?.filter((plan) => selectedBudgetPlanIds.includes(plan.id)) ?? [],
    [budgetPlans, selectedBudgetPlanIds]
  );

  const budgetPlanDisplay =
    selectedBudgetPlans.length > 0
      ? selectedBudgetPlans.map((plan) => plan.description || '-').join(', ')
      : '-';

  const detailRowOne = [
    { label: 'เลขใบขอซื้อขอจ้าง (PR)', value: project.pr_no || '-', isCopyable: !!project.pr_no },
    { label: 'เลขใบสั่งซื้อ (PO)', value: project.po_no || '-', isCopyable: !!project.po_no },
    { label: 'เลขที่ลงรับ', value: project.receive_no || '-', isCopyable: !!project.receive_no },
    {
      label: 'เลขที่รับจาก lesspaper (ถ้ามี)',
      value: project.less_no || '-',
      isCopyable: !!project.less_no,
    },
    { label: 'เลขที่สัญญา', value: project.contract_no || '-', isCopyable: !!project.contract_no },
  ];

  const detailRowTwo = [
    { label: 'วิธีการจัดหา', value: project.procurement_type },
    { label: 'หน่วยงาน', value: project.requester.unit_name || '-' },
    { label: 'ฝ่าย', value: project.requester.dept_name || '-' },
    { label: 'วงเงินงบประมาณ (บาท)', value: formatNumberThai(project.budget) },
    {
      label: 'วันครบกำหนดส่งมอบ',
      value: project.expected_approval_date
        ? formatDateThai(project.expected_approval_date, 'd MMM yyyy')
        : '-',
    },
  ];

  const handleSaveProjectInfo = () => {
    setIsEditingProjectInfo(false);
    toast.success('บันทึกข้อมูลส่วนนี้เฉพาะในหน้าปัจจุบันแล้ว');
  };

  const handleCancelProjectInfo = () => {
    setHasAssetCode((project.budget_plan_id?.length ?? 0) > 0);
    setSelectedBudgetPlanIds(project.budget_plan_id ?? []);
    setIsEditingProjectInfo(false);
  };

  const handleSaveVendor = async () => {
    try {
      await onSaveVendorInfo?.({
        vendor_name: vendorName.trim(),
        vendor_email: vendorEmail.trim(),
      });
      setIsEditingVendor(false);
    } catch {
      // Error toast is handled by parent.
    }
  };

  const handleCancelVendor = () => {
    setVendorName(project.vendor.name ?? '');
    setVendorEmail(project.vendor.email ?? '');
    setIsEditingVendor(false);
  };

  const toggleBudgetPlan = (planId: string) => {
    setSelectedBudgetPlanIds((previous) =>
      previous.includes(planId) ? previous.filter((id) => id !== planId) : [...previous, planId]
    );
  };

  return (
    <Card className="space-y-6 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h6 className="text-primary h3-topic">รายละเอียดโครงการ</h6>
          {!isEditingProjectInfo && canEditProjectDetails ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditingProjectInfo(true)}>
              <Pencil className="h-4 w-4" />
              แก้ไขข้อมูลโครงการ
            </Button>
          ) : isEditingProjectInfo ? (
            <div className="flex items-center gap-2">
              <Button variant="brand" size="sm" onClick={handleSaveProjectInfo}>
                <Check className="h-4 w-4" />
                บันทึก
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancelProjectInfo}>
                <X className="h-4 w-4" />
                ยกเลิก
              </Button>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {detailRowOne.map((item) => (
            <ReadonlyFieldCell
              key={item.label}
              label={item.label}
              value={item.value}
              isCopyable={item.isCopyable}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {detailRowTwo.map((item) => (
            <ReadonlyFieldCell key={item.label} label={item.label} value={item.value} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ReadonlyFieldCell
            label="วันที่รับเอกสาร"
            value={formatDateThai(project.created_at, 'd MMM yyyy')}
          />
          <ReadonlyFieldCell label="วันที่ส่งให้ทีมตรวจรับ" value="-" />
          <div className="flex min-h-14 flex-col gap-1">
            <span className="text-muted-foreground h4-sub">มีรหัสสินทรัพย์หรือไม่</span>
            <label className="flex h-9 items-center gap-2">
              <Checkbox
                checked={hasAssetCode}
                onCheckedChange={(checked) => {
                  const nextValue = Boolean(checked);
                  setHasAssetCode(nextValue);
                  if (!nextValue) {
                    setSelectedBudgetPlanIds([]);
                  }
                }}
                disabled={!isEditingProjectInfo}
              />
              <span className="normal">มีรหัสสินทรัพย์</span>
            </label>
          </div>
          {hasAssetCode && (
            <div className="flex min-h-14 flex-col gap-1 lg:col-span-2">
              <span className="text-muted-foreground h4-sub">แผนงบประมาณ</span>
              {isEditingProjectInfo ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        'border-input bg-background ring-offset-background focus:ring-ring flex min-h-9 w-full items-center justify-between rounded-lg border px-3 py-1.5 text-left text-base focus:ring-2 focus:ring-offset-2 focus:outline-none'
                      )}
                    >
                      <span className="line-clamp-1">
                        {selectedBudgetPlans.length > 0
                          ? selectedBudgetPlans.map((plan) => plan.description || '-').join(', ')
                          : 'กรุณาเลือกแผนงบประมาณ'}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                    <div className="max-h-64 overflow-y-auto">
                      {isLoadingBudgetPlans && (
                        <div className="text-muted-foreground px-3 py-3 text-sm">
                          กำลังโหลดข้อมูลแผนงบประมาณ...
                        </div>
                      )}
                      {!isLoadingBudgetPlans && budgetPlans?.length === 0 && (
                        <div className="text-muted-foreground px-3 py-3 text-sm">
                          ไม่พบข้อมูลแผนงบประมาณ
                        </div>
                      )}
                      {!isLoadingBudgetPlans &&
                        budgetPlans?.map((plan) => {
                          const isSelected = selectedBudgetPlanIds.includes(plan.id);
                          return (
                            <div
                              key={plan.id}
                              className="border-border flex cursor-pointer items-center gap-3 border-b px-3 py-3 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              onClick={(event) => {
                                event.preventDefault();
                                toggleBudgetPlan(plan.id);
                              }}
                            >
                              <Checkbox checked={isSelected} className="pointer-events-none" />
                              <span className="normal">{plan.description || '-'}</span>
                            </div>
                          );
                        })}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <span className="normal">{budgetPlanDisplay}</span>
              )}
              <span className="text-muted-foreground caption">
                ข้อมูลแผนงบประมาณบันทึกเฉพาะในหน้านี้
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h6 className="text-primary h3-topic">ข้อมูลของผู้ค้า</h6>
          {!isEditingVendor && canEditProjectDetails ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditingVendor(true)}>
              <Pencil className="h-4 w-4" />
              แก้ไขข้อมูลผู้ค้า
            </Button>
          ) : isEditingVendor ? (
            <div className="flex items-center gap-2">
              <Button
                variant="brand"
                size="sm"
                onClick={handleSaveVendor}
                disabled={isSavingVendorInfo}
              >
                <Check className="h-4 w-4" />
                บันทึก
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelVendor}
                disabled={isSavingVendorInfo}
              >
                <X className="h-4 w-4" />
                ยกเลิก
              </Button>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex min-h-14 flex-col gap-1">
            <span className="text-muted-foreground h4-sub">ชื่อผู้ค้า</span>
            {isEditingVendor ? (
              <Input
                value={vendorName}
                onChange={(event) => setVendorName(event.target.value)}
                placeholder="กรุณากรอกชื่อผู้ค้า"
                disabled={isSavingVendorInfo}
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="normal">{vendorName || '-'}</span>
                {vendorName && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => {
                      navigator.clipboard.writeText(vendorName);
                    }}
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="flex min-h-14 flex-col gap-1">
            <span className="text-muted-foreground h4-sub">อีเมล</span>
            {isEditingVendor ? (
              <Input
                value={vendorEmail}
                onChange={(event) => setVendorEmail(event.target.value)}
                placeholder="กรุณากรอกอีเมล"
                disabled={isSavingVendorInfo}
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="normal">{vendorEmail || '-'}</span>
                {vendorEmail && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => {
                      navigator.clipboard.writeText(vendorEmail);
                    }}
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
