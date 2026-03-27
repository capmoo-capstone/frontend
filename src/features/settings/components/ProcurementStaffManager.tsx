import { useMemo, useState } from 'react';

import { Search, UserPlus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  PROCUREMENT_PEOPLE,
  PROCUREMENT_ROLE_SETTINGS,
  type ProcurementRoleSetting,
  getPersonNameById,
} from '@/features/settings/mock-data';
import { type DelegationPayload, createProcurementRoleSchema } from '@/features/settings/types';
import { UserSelect } from '@/features/users/components/UserSelect';

import { DelegationFormSection } from './DelegationFormSection';
import { InlineActionRow } from './InlineActionRow';

const DIRECTOR_ROLE_ID = 'director';

export function ProcurementStaffManager() {
  const [roles, setRoles] = useState<ProcurementRoleSetting[]>(PROCUREMENT_ROLE_SETTINGS);

  return (
    <>
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">ตั้งค่าเจ้าหน้าที่พัสดุ</h1>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span>เจ้าหน้าที่พัสดุ</span>
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
  const [isEditing, setIsEditing] = useState(false);
  const [draftMemberIds, setDraftMemberIds] = useState<string[]>(role.member_ids);
  const [memberToAdd, setMemberToAdd] = useState('');
  const [memberToAddLabel, setMemberToAddLabel] = useState('');
  const [showDelegation, setShowDelegation] = useState(false);
  const [delegation, setDelegation] = useState<DelegationPayload | null>(role.delegation);
  const [error, setError] = useState('');

  const isDirectorRole = role.id === DIRECTOR_ROLE_ID;

  const selectedNames = useMemo(
    () => draftMemberIds.map((memberId) => getPersonNameById(memberId)).join(', '),
    [draftMemberIds]
  );

  const handleAddMember = () => {
    if (!memberToAdd) return;

    if (role.allow_multiple) {
      if (!draftMemberIds.includes(memberToAdd)) {
        setDraftMemberIds((prev) => [...prev, memberToAdd]);
      }
    } else {
      setDraftMemberIds([memberToAdd]);
    }

    setMemberToAdd('');
    setMemberToAddLabel('');
  };

  const handleSave = () => {
    setError('');

    const schema = createProcurementRoleSchema({
      allowMultiple: role.allow_multiple,
      isDirectorRole,
    });
    const parsed = schema.safeParse({
      member_ids: draftMemberIds,
      delegation: showDelegation ? delegation : null,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง');
      return;
    }

    if (isDirectorRole && delegation?.user_id) {
      const otherRoles = allRoles.filter((item) => item.id !== role.id);
      const isHeadElsewhere = otherRoles.some((item) =>
        item.member_ids.includes(delegation.user_id)
      );
      if (isHeadElsewhere) {
        const confirmed = window.confirm(
          'ผู้ที่เลือกเป็นผู้รักษาการมีตำแหน่งในบทบาทอื่นอยู่แล้ว ต้องการยืนยันการแต่งตั้งหรือไม่?'
        );
        if (!confirmed) return;
      }
    }

    onSave({
      ...role,
      member_ids: draftMemberIds,
      delegation: showDelegation ? delegation : null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftMemberIds(role.member_ids);
    setDelegation(role.delegation);
    setShowDelegation(!!role.delegation);
    setMemberToAdd('');
    setMemberToAddLabel('');
    setError('');
    setIsEditing(false);
  };

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
                {formatThaiDate(role.delegation.start_date)}
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
                    onClick={() =>
                      setDraftMemberIds((prev) => prev.filter((id) => id !== memberId))
                    }
                    className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {isDirectorRole && (
              <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDelegation((prev) => !prev)}
                >
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
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

const formatThaiDate = (date?: Date) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};
