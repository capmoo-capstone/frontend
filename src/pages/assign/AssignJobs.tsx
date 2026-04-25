'use client';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { type UnitItem, useUnits } from '@/features/organization';
import { AssignedTable, UnassignTable, WaitingCancelTable, WorkloadChart } from '@/features/projects';
import { OPS_DEPT_ID } from '@/lib/constants';
import {
  hasDepartmentPermission,
  hasSelfManagePermission,
  hasUnitPermission,
} from '@/lib/permissions';

export default function AssignJobs() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

  const { data: units, isLoading } = useUnits(OPS_DEPT_ID);

  const unitOptions = useMemo(() => {
    if (!units || !user) return [];

    const allUnits = Array.isArray(units) ? units : [];

    return allUnits.filter(
      (unit: UnitItem) =>
        hasUnitPermission(user, unit.id) ||
        hasDepartmentPermission(user, unit.dept_id) ||
        hasSelfManagePermission(user, unit.id)
    );
  }, [units, user]);

  useEffect(() => {
    if (id || isLoading) return;
    if (unitOptions.length > 0) {
      navigate(`/app/assign/${unitOptions[0].id}`, { replace: true });
    }
  }, [id, isLoading, navigate, unitOptions]);

  if (isLoading || (!id && unitOptions.length > 0)) {
    return <div className="text-muted-foreground p-4 text-sm">กำลังโหลดข้อมูลกลุ่มงาน...</div>;
  }

  if (!id || unitOptions.length === 0) {
    return <div className="text-muted-foreground p-4 text-sm">ไม่พบกลุ่มงานที่มีสิทธิ์เข้าถึง</div>;
  }

  const handleUnitChange = (newUnitId: string) => {
    navigate(`/app/assign/${newUnitId}`);
  };

  return (
    <div className="relative space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="h1-topic text-primary">{`มอบหมายงาน`}</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">เลือกกลุ่มงาน:</label>
          <Select value={id} onValueChange={handleUnitChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="เลือกกลุ่มงาน" />
            </SelectTrigger>
            <SelectContent>
              {unitOptions.map((unit: UnitItem) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <WorkloadChart pendingChanges={pendingChanges} unitId={id} />
      <WaitingCancelTable unitId={id} />
      <UnassignTable
        unitId={id}
        pendingChanges={pendingChanges}
        setPendingChanges={setPendingChanges}
      />
      <AssignedTable unitId={id} />
    </div>
  );
}
