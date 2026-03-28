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
  const [draftDelegations, setDraftDelegations] = useState<DelegationPayload[]>(role.delegation);
  const [delegationToAdd, setDelegationToAdd] = useState<DelegationPayload | null>(null);
  const [delegationFormResetKey, setDelegationFormResetKey] = useState(0);
  const [error, setError] = useState('');

  const isDirectorRole = role.id === DIRECTOR_ROLE_ID;
  const directorMemberId = draftMemberIds[0] ?? '';

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
  };

  const handleRemoveMember = (memberId: string) => {
    setDraftMemberIds((prev) => prev.filter((id) => id !== memberId));
  };

  const handleSetDirectorMember = (memberId: string) => {
    setDraftMemberIds(memberId ? [memberId] : []);
  };

  const handleAddDelegation = () => {
    if (!delegationToAdd) {
      setError('กรุณากรอกข้อมูลการมอบหมายให้ครบถ้วน');
      return;
    }

    if (isDirectorRole && draftDelegations.length >= 1) {
      setError('ตำแหน่งผู้อำนวยการกำหนดผู้รักษาการได้เพียง 1 รายการเท่านั้น');
      return;
    }

    setDraftDelegations((prev) => [...prev, delegationToAdd]);
    setDelegationToAdd(null);
    setDelegationFormResetKey((prev) => prev + 1);
    setError('');
  };

  const handleRemoveDelegation = (index: number) => {
    setDraftDelegations((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
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
      delegations: draftDelegations,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง');
      return;
    }

    if (isDirectorRole && draftDelegations.length > 0) {
      const otherRoles = allRoles.filter((item) => item.id !== role.id);
      const delegatedUserIds = new Set(draftDelegations.map((item) => item.user_id));
      const isHeadElsewhere = otherRoles.some((item) =>
        item.member_ids.some((memberId) => delegatedUserIds.has(memberId))
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
      delegation: draftDelegations,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftMemberIds(role.member_ids);
    setDraftDelegations(role.delegation);
    setDelegationToAdd(null);
    setMemberToAdd('');
    setError('');
    setIsEditing(false);
  };

  return {
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
  };
}
