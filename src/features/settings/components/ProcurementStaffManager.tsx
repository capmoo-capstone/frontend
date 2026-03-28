import { useState } from 'react';

import { Search, UserPlus, Users, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  PROCUREMENT_PEOPLE,
  PROCUREMENT_ROLE_SETTINGS,
  type ProcurementRoleSetting,
  getPersonNameById,
} from '@/features/settings/mock-data';
import { UserSelect } from '@/features/users/components/UserSelect';
import { formatDateThaiShort } from '@/lib/formatters';

import { useProcurementRoleEditor } from '../hooks/useProcurementRoleEditor';
import { DelegationFormSection } from './DelegationFormSection';
import { InlineActionRow } from './InlineActionRow';

export function ProcurementStaffManager() {
  const [roles, setRoles] = useState<ProcurementRoleSetting[]>(PROCUREMENT_ROLE_SETTINGS);

  return (
    <>
      <header className="space-y-3">
        <h1 className="h1-topic text-primary">ตั้งค่าเจ้าหน้าที่พัสดุ</h1>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="text-primary mb-4 flex items-center gap-2 text-lg font-semibold">
          <div className="flex items-center">
            <Users className="mr-2 h-6 w-6" />
            เจ้าหน้าที่พัสดุ
          </div>
        </div>

        <div className="divide-y">
          {roles.map((role) => (
            <RoleRow
              key={role.id}
              role={role}
              allRoles={roles}
              onSave={(updated) => {
                setRoles((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}

interface RoleRowProps {
  role: ProcurementRoleSetting;
  allRoles: ProcurementRoleSetting[];
  onSave: (role: ProcurementRoleSetting) => void;
}

function RoleRow({ role, allRoles, onSave }: RoleRowProps) {
  const {
    delegation,
    draftMemberIds,
    error,
    isDirectorRole,
    isEditing,
    memberToAdd,
    memberToAddLabel,
    selectedNames,
    setDelegation,
    setMemberToAdd,
    setMemberToAddLabel,
    showDelegation,
    handleAddMember,
    handleCancel,
    handleEdit,
    handleRemoveMember,
    handleSave,
    handleToggleDelegation,
  } = useProcurementRoleEditor({ role, allRoles, onSave });

  return (
    <div className="py-1">
      <InlineActionRow
        label={<span className="font-semibold text-slate-800">{role.label}</span>}
        isEditing={isEditing}
        viewContent={
          <div className="space-y-2 py-1">
            <p>{selectedNames}</p>
            {role.delegation?.user_id && (
              <p className="text-xs text-slate-500">
                รักษาการโดย {getPersonNameById(role.delegation.user_id)} เริ่ม{' '}
                {formatDateThaiShort(role.delegation.start_date)}
              </p>
            )}
          </div>
        }
        editContent={
          <div className="space-y-3 py-1">
            <div className="flex flex-wrap items-center gap-2">
              <UserSelect
                value={memberToAdd}
                deptId="procurement"
                options={PROCUREMENT_PEOPLE}
                placeholder="กรุณาเลือกเจ้าหน้าที่"
                onChange={(id) => {
                  setMemberToAdd(id);
                }}
                onSelectUser={(user) => setMemberToAddLabel(user.full_name)}
                className="w-full max-w-[320px]"
                hasClearButton={false}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddMember}
                disabled={!memberToAdd}
              >
                <UserPlus className="mr-1 h-4 w-4" /> เพิ่มสมาชิก
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {draftMemberIds.map((memberId) => (
                <div
                  key={memberId}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm"
                >
                  <span>{getPersonNameById(memberId)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(memberId)}
                    className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {isDirectorRole && (
              <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                <Button type="button" variant="outline" onClick={handleToggleDelegation}>
                  <Search className="mr-1 h-4 w-4" />{' '}
                  {showDelegation ? 'ซ่อนผู้แทน' : 'เพิ่มผู้แทน'}
                </Button>
                {showDelegation && (
                  <DelegationFormSection
                    value={delegation}
                    onChange={setDelegation}
                    people={PROCUREMENT_PEOPLE}
                    roleContext="director"
                  />
                )}
              </div>
            )}

            {memberToAddLabel && (
              <p className="text-xs text-slate-500">พร้อมเพิ่ม: {memberToAddLabel}</p>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        }
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
