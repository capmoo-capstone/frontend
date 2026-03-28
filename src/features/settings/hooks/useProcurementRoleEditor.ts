import { useMemo, useState } from 'react';

import type { ProcurementRoleSetting } from '@/features/settings/mock-data';
import { getPersonNameById } from '@/features/settings/mock-data';
import { type DelegationPayload, createProcurementRoleSchema } from '@/features/settings/types';

const DIRECTOR_ROLE_ID = 'director';

interface UseProcurementRoleEditorParams {
  role: ProcurementRoleSetting;
  allRoles: ProcurementRoleSetting[];
  onSave: (role: ProcurementRoleSetting) => void;
}

export function useProcurementRoleEditor({
  role,
  allRoles,
  onSave,
}: UseProcurementRoleEditorParams) {
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

  const handleRemoveMember = (memberId: string) => {
    setDraftMemberIds((prev) => prev.filter((id) => id !== memberId));
  };

  const handleToggleDelegation = () => {
    setShowDelegation((prev) => !prev);
  };

  const handleEdit = () => {
    setIsEditing(true);
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

  return {
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
  };
}
