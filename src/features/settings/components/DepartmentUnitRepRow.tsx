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
        <section className="space-y-2">
          <section className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <span className="text-primary normal w-full shrink-0 sm:w-40">
              ตั้งตัวแทนหน่วยงาน <span className="text-error">*</span>
            </span>
            <section className="w-full min-w-0 sm:flex-1">
              <UserSelect
                value={selectedUserId}
                deptId={departmentId}
                unitId={unit.id}
                onChange={(userId) => handleSelectUser(userId)}
                onSelectUser={(user) => handleSelectUser(user.id, user.full_name)}
                className="min-w-[320px]"
                placeholder="กรุณาเลือกเจ้าหน้าที่"
                hasClearButton={false}
              />
            </section>
          </section>
          {error && <p className="caption text-red-500">{error}</p>}
        </section>
      }
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
      disableSave={!selectedUserId}
      isSaving={isSaving}
    />
  );
}
