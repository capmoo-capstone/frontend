import { useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import {
  InlineActionRow,
  UserSearchCombobox,
  createDepartmentRepresentativeSchema,
  useDepartmentRepData,
  useDepartmentUnits,
  useUpdateUnitRepresentative,
} from '@/features/settings';

export default function DepartmentRepsPage() {
  const { data: departments, isLoading } = useDepartmentRepData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return departments ?? [];
    const keyword = searchTerm.trim().toLowerCase();
    return (departments ?? []).filter((dept) => dept.name.toLowerCase().includes(keyword));
  }, [departments, searchTerm]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] p-6">
        <p className="text-muted-foreground text-sm">กำลังโหลดข้อมูลหน่วยงาน...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-5 p-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">ตั้งค่าตัวแทนหน่วยงาน</h1>
      </header>

      <div className="flex justify-end">
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="ค้นหาชื่อเจ้าหน้าที่, หน่วยงาน, ฝ่าย..."
          className="w-full max-w-md"
        />
      </div>

      <Accordion type="multiple" className="space-y-4">
        {filteredDepartments.map((dept) => (
          <AccordionItem
            key={dept.id}
            value={dept.id}
            className="rounded-lg border border-slate-200 bg-white px-4"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              {dept.name}
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <UnitList departmentId={dept.id} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

interface UnitListProps {
  departmentId: string;
}

function UnitList({ departmentId }: UnitListProps) {
  const { data: units } = useDepartmentUnits(departmentId);

  return (
    <div className="divide-y">
      {units?.map((unit) => (
        <UnitRepRow key={unit.id} departmentId={departmentId} unit={unit} />
      ))}
    </div>
  );
}

interface UnitItem {
  id: string;
  name: string;
  representative?: { id: string; name: string } | null;
}

interface UnitRepRowProps {
  departmentId: string;
  unit: UnitItem;
}

function UnitRepRow({ departmentId, unit }: UnitRepRowProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(unit.representative?.id || '');
  const [selectedUserName, setSelectedUserName] = useState(unit.representative?.name || '');
  const [error, setError] = useState('');

  const updateRepresentative = useUpdateUnitRepresentative();

  const handleCancel = () => {
    setSelectedUserId(unit.representative?.id || '');
    setSelectedUserName(unit.representative?.name || '');
    setError('');
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!selectedUserId || !selectedUserName) return;

    const allUnits = queryClient
      .getQueriesData<Array<UnitItem>>({ queryKey: ['units'] })
      .flatMap(([, units]) => units ?? [])
      .map((item) => ({ unitId: item.id, userId: item.representative?.id }));

    const schema = createDepartmentRepresentativeSchema({
      currentUnitId: unit.id,
      allAssignments: allUnits,
    });

    const parsed = schema.safeParse({ user_id: selectedUserId });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง');
      return;
    }

    setError('');

    updateRepresentative.mutate(
      {
        departmentId,
        unitId: unit.id,
        userId: selectedUserId,
        userName: selectedUserName,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <InlineActionRow
      label={unit.name}
      isEditing={isEditing}
      viewContent={unit.representative?.name || 'ยังไม่ระบุตัวแทน'}
      editContent={
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground w-40 shrink-0 text-sm">
              ตั้งตัวแทนหน่วยงาน *
            </span>
            <UserSearchCombobox
              value={selectedUserId}
              departmentId={departmentId}
              unitId={unit.id}
              onChange={(id, name) => {
                setSelectedUserId(id);
                setSelectedUserName(name);
              }}
              className="max-w-md"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      }
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
      disableSave={!selectedUserId}
      isSaving={updateRepresentative.isPending}
    />
  );
}
