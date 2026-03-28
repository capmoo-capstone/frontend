import { useState } from 'react';

import { Trash2, UserPlus, Users, X } from 'lucide-react';

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

      <section className="border-border rounded-lg border bg-white p-5">
        <div className="h2-topic flex items-center">
          <Users className="mr-2 h-6 w-6" />
          เจ้าหน้าที่พัสดุ
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
    delegationToAdd,
    delegationFormResetKey,
    directorMemberId,
    draftDelegations,
    draftMemberIds,
    error,
    isDirectorRole,
    isEditing,
    memberToAdd,
    selectedNames,
    setDelegationToAdd,
    setMemberToAdd,
    handleAddMember,
    handleAddDelegation,
    handleCancel,
    handleEdit,
    handleRemoveDelegation,
    handleRemoveMember,
    handleSetDirectorMember,
    handleSave,
  } = useProcurementRoleEditor({ role, allRoles, onSave });

  return (
    <div className="py-1">
      <InlineActionRow
        label={role.label}
        isEditing={isEditing}
        viewContent={
          <div className="space-y-2 py-1">
            <p>{selectedNames}</p>
            {isDirectorRole &&
              role.delegation.map((delegation, index) => (
                <p key={`${delegation.user_id}-${index}`} className="text-muted-foreground caption">
                  รักษาการโดย {getPersonNameById(delegation.user_id)} เริ่ม{' '}
                  {formatDateThaiShort(delegation.start_date)}
                  {delegation.end_date
                    ? ` สิ้นสุด ${formatDateThaiShort(delegation.end_date)}`
                    : ''}
                </p>
              ))}
          </div>
        }
        editContent={
          <div className="space-y-3 py-1">
            {isDirectorRole ? (
              <>
                <div className="space-y-1">
                  <p className="text-primary normal-b">ผู้อำนวยการ</p>
                  <p className="text-muted-foreground caption">
                    ปัจจุบัน: {getPersonNameById(role.member_ids[0] ?? '')}
                  </p>
                  <UserSelect
                    value={directorMemberId}
                    deptId="procurement"
                    options={PROCUREMENT_PEOPLE}
                    placeholder="กรุณาเลือกหัวหน้าพัสดุ"
                    onChange={handleSetDirectorMember}
                    className="w-xs max-w-xs min-w-xs"
                    hasClearButton={false}
                  />
                </div>

                <div className="space-y-2">
                  {draftDelegations.length > 0 && (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-primary normal-b">การมอบหมายรักษาการ</p>
                      </div>

                      {draftDelegations.map((delegation, index) => (
                        <div
                          key={`${delegation.user_id}-${index}`}
                          className="border-border space-y-2 rounded-md border bg-white p-3"
                        >
                          <p className="text-primary normal">
                            ผู้แทนปัจจุบัน: {getPersonNameById(delegation.user_id)}
                          </p>
                          <p className="text-muted-foreground caption">
                            เริ่ม {formatDateThaiShort(delegation.start_date)}
                            {delegation.end_date
                              ? ` สิ้นสุด ${formatDateThaiShort(delegation.end_date)}`
                              : ' (ไม่กำหนดวันที่สิ้นสุด)'}
                          </p>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => handleRemoveDelegation(index)}
                          >
                            <Trash2 className="mr-1 h-4 w-4" /> ลบการมอบหมาย
                          </Button>
                        </div>
                      ))}
                    </>
                  )}

                  {draftDelegations.length === 0 && (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-primary normal-b">สร้างการมอบหมาย</p>
                      </div>

                      <DelegationFormSection
                        value={delegationToAdd}
                        onChange={setDelegationToAdd}
                        people={PROCUREMENT_PEOPLE}
                        resetKey={delegationFormResetKey}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddDelegation}
                        disabled={!delegationToAdd}
                      >
                        <UserPlus className="mr-1 h-4 w-4" /> เพิ่มการมอบหมาย
                      </Button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <UserSelect
                    value={memberToAdd}
                    deptId="procurement"
                    options={PROCUREMENT_PEOPLE}
                    placeholder="กรุณาเลือกเจ้าหน้าที่"
                    onChange={(id) => {
                      setMemberToAdd(id);
                    }}
                    className="min-w-[320px]"
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

                <div className="flex flex-col gap-2">
                  {draftMemberIds.map((memberId) => (
                    <div
                      key={memberId}
                      className="normal flex max-w-sm shrink justify-between gap-4 self-start"
                    >
                      <span>{getPersonNameById(memberId)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(memberId)}
                        className="text-error flex cursor-pointer flex-row items-center gap-1 hover:underline"
                      >
                        นำออก
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {error && <p className="caption text-error">{error}</p>}
          </div>
        }
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
