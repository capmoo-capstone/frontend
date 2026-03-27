import { UserSelect } from '@/features/users/components/UserSelect';

import { type UnitItem, useUnitRepresentativeEditor } from '../hooks/useUnitRepresentativeEditor';
import { InlineActionRow } from './InlineActionRow';

interface DepartmentUnitRepRowProps {
  departmentId: string;
  unit: UnitItem;
}

export function DepartmentUnitRepRow({ departmentId, unit }: DepartmentUnitRepRowProps) {
  const {
    error,
    isEditing,
    isSaving,
    selectedUserId,
    setIsEditing,
    handleCancel,
    handleSave,
    handleSelectUser,
  } = useUnitRepresentativeEditor({
    departmentId,
    unit,
  });

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
            <UserSelect
              value={selectedUserId}
              deptId={departmentId}
              unitId={unit.id}
              onChange={(userId) => handleSelectUser(userId)}
              onSelectUser={(user) => handleSelectUser(user.id, user.full_name)}
              className="w-full max-w-xs"
              placeholder="กรุณาเลือกเจ้าหน้าที่"
              hasClearButton={false}
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      }
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
      disableSave={!selectedUserId}
      isSaving={isSaving}
    />
  );
}
