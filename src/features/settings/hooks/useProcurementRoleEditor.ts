import { useEffect, useMemo, useState } from 'react';

import { DIRECTOR_ROLE_ID } from '../constants';
import {
  type DelegationPayload,
  type ProcurementRoleSetting,
  createProcurementRoleSchema,
} from '../types';
import { hasDelegatedRoleMemberConflict } from './delegationConflictUtils';
import { useDelegationFormReset } from './useDelegationFormReset';

interface UseProcurementRoleEditorParams {
  role: ProcurementRoleSetting;
  allRoles: ProcurementRoleSetting[];
  getPersonNameById: (id: string) => string;
  onSave: (role: ProcurementRoleSetting) => void;
}

export function useProcurementRoleEditor({
  role,
  allRoles,
  getPersonNameById,
  onSave,
}: UseProcurementRoleEditorParams) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftMemberIds, setDraftMemberIds] = useState<string[]>(role.member_ids);
  const [memberToAdd, setMemberToAdd] = useState('');
  const [draftDelegations, setDraftDelegations] = useState<DelegationPayload[]>(role.delegation);
  const [delegationToAdd, setDelegationToAdd] = useState<DelegationPayload | null>(null);
  const { delegationFormResetKey, bumpDelegationFormResetKey } = useDelegationFormReset();
  const [error, setError] = useState('');

  const isDirectorRole = role.id === DIRECTOR_ROLE_ID;
  const directorMemberId = draftMemberIds[0] ?? '';

  useEffect(() => {
    if (!isEditing) {
      setDraftMemberIds(role.member_ids);
      setDraftDelegations(role.delegation);
      setDelegationToAdd(null);
      setMemberToAdd('');
      setError('');
    }
  }, [isEditing, role.member_ids, role.delegation]);

  const resetEditorState = () => {
    setDraftMemberIds(role.member_ids);
    setDraftDelegations(role.delegation);
    setDelegationToAdd(null);
    setMemberToAdd('');
    setError('');
  };

  const selectedNames = useMemo(() => {
    const ids = isEditing ? draftMemberIds : role.member_ids;
    return ids.map((memberId) => getPersonNameById(memberId)).join(', ');
  }, [isEditing, draftMemberIds, role.member_ids, getPersonNameById]);

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
    bumpDelegationFormResetKey();
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
      // TODO (BACKEND MIGRATION): Cross-role conflict validation and confirmation workflow should be validated by backend business rules.
      const delegatedUserIds = new Set(draftDelegations.map((item) => item.user_id));
      const isHeadElsewhere = hasDelegatedRoleMemberConflict(delegatedUserIds, allRoles, role.id);
      if (isHeadElsewhere) {
        const confirmed = window.confirm(
          'ผู้ที่เลือกเป็นผู้รักษาการมีตำแหน่งในบทบาทอื่นอยู่แล้ว ต้องการยืนยันการแต่งตั้งหรือไม่?'
        );
        if (!confirmed) return;
      }
    }

    // TODO (BACKEND): Connect this UI action to the corresponding API endpoint for Save Procurement Role Changes.
    onSave({
      ...role,
      member_ids: draftMemberIds,
      delegation: draftDelegations,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    resetEditorState();
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
