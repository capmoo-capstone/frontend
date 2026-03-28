import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  DIRECTOR_USER_ID,
  PROCUREMENT_PEOPLE,
  type WorkGroupSetting,
} from '@/features/settings/mock-data';
import {
  type DelegationPayload,
  type WorkGroupFormInput,
  createWorkGroupValidationSchema,
} from '@/features/settings/types';
import { RESPONSIBLE_SELECT_OPTIONS } from '@/lib/formatters';

import { getFormErrorMessages, normalizeDelegation } from '../components/workGroupFormUtils';

interface UseWorkGroupCardEditorParams {
  group: WorkGroupSetting;
  groups: WorkGroupSetting[];
  onSave: (group: WorkGroupSetting) => void;
}

export function useWorkGroupCardEditor({ group, groups, onSave }: UseWorkGroupCardEditorParams) {
  // TODO (BACKEND MIGRATION): Group membership, workflow assignments, and delegation conflict checks should be enforced by backend transactions.
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [memberToAdd, setMemberToAdd] = useState('');
  const [delegationToAdd, setDelegationToAdd] = useState<DelegationPayload | null>(null);
  const [delegationFormResetKey, setDelegationFormResetKey] = useState(0);

  const workGroupValidationSchema = useMemo(
    () =>
      createWorkGroupValidationSchema({
        currentGroupId: group.id,
        existingGroups: groups,
        directorUserId: DIRECTOR_USER_ID,
      }),
    [group.id, groups]
  );

  const form = useForm<WorkGroupFormInput>({
    resolver: zodResolver(workGroupValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      name: group.name,
      workflow_types: group.workflow_types,
      head_id: group.head_id,
      member_ids: group.member_ids,
      delegation: group.delegation,
    },
  });

  const draft = form.watch();
  const draftMemberIds = draft.member_ids ?? [];
  const draftDelegation = normalizeDelegation(draft.delegation);

  const validationErrors = useMemo(
    () => getFormErrorMessages(form.formState.errors),
    [form.formState.errors]
  );

  const resetToGroup = () => {
    form.reset({
      name: group.name,
      workflow_types: group.workflow_types,
      head_id: group.head_id,
      member_ids: group.member_ids,
      delegation: group.delegation,
    });
    setDelegationToAdd(null);
    setDelegationFormResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    resetToGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    group.id,
    group.name,
    group.head_id,
    group.delegation,
    group.member_ids,
    group.workflow_types,
  ]);

  const availableMembers = useMemo(() => {
    const headsFromOtherGroups = new Set(
      groups.filter((item) => item.id !== group.id).map((item) => item.head_id)
    );

    const membersFromOtherGroups = new Set(
      groups.filter((item) => item.id !== group.id).flatMap((item) => item.member_ids)
    );

    return PROCUREMENT_PEOPLE.filter((person) => {
      if (person.id === DIRECTOR_USER_ID) return false;
      if (headsFromOtherGroups.has(person.id)) return false;
      if (membersFromOtherGroups.has(person.id)) return false;
      return true;
    });
  }, [group.id, groups]);

  const usedWorkflowByOtherGroups = useMemo(
    () =>
      new Set(groups.filter((item) => item.id !== group.id).flatMap((item) => item.workflow_types)),
    [group.id, groups]
  );

  const availableWorkflowOptions = useMemo(
    () =>
      RESPONSIBLE_SELECT_OPTIONS.filter(
        (option) =>
          !draft.workflow_types.includes(option.value) &&
          !usedWorkflowByOtherGroups.has(option.value)
      ),
    [draft.workflow_types, usedWorkflowByOtherGroups]
  );

  const removeWorkflowType = (type: string) => {
    form.setValue(
      'workflow_types',
      draft.workflow_types.filter((item) => item !== type),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const addWorkflowTypes = (typesToAdd: string[]) => {
    const nextTypes = Array.from(new Set([...draft.workflow_types, ...typesToAdd]));
    form.setValue('workflow_types', nextTypes, { shouldDirty: true, shouldValidate: true });
  };

  const addDraftMember = () => {
    if (!memberToAdd) return;
    if (!availableMembers.some((person) => person.id === memberToAdd)) return;
    if (draftMemberIds.includes(memberToAdd)) return;

    form.setValue('member_ids', [...draftMemberIds, memberToAdd], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setMemberToAdd('');
  };

  const removeDraftMember = (memberId: string) => {
    form.setValue(
      'member_ids',
      draftMemberIds.filter((id) => id !== memberId),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const removeDelegation = () => {
    form.setValue('delegation', null, { shouldDirty: true, shouldValidate: true });
    setDelegationToAdd(null);
    setDelegationFormResetKey((prev) => prev + 1);
  };

  const addDelegation = () => {
    if (!delegationToAdd) return;
    form.setValue('delegation', delegationToAdd, { shouldDirty: true, shouldValidate: true });
    setDelegationToAdd(null);
    setDelegationFormResetKey((prev) => prev + 1);
  };

  const handleSave = form.handleSubmit((values) => {
    if (values.delegation?.user_id) {
      const isHeadElsewhere = groups
        .filter((item) => item.id !== group.id)
        .some((item) => item.head_id === values.delegation?.user_id);

      if (isHeadElsewhere) {
        const ok = window.confirm(
          'ผู้แทนที่เลือกเป็นหัวหน้ากลุ่มงานอื่นอยู่แล้ว ต้องการยืนยันการแต่งตั้งหรือไม่?'
        );
        if (!ok) return;
      }
    }

    onSave({
      ...group,
      ...values,
      member_ids: values.member_ids ?? [],
      delegation: normalizeDelegation(values.delegation),
    });

    setIsEditing(false);
  });

  const handleCancel = () => {
    resetToGroup();
    setMemberToAdd('');
    setIsEditing(false);
  };

  return {
    draft,
    form,
    isEditing,
    isExpanded,
    memberToAdd,
    delegationToAdd,
    delegationFormResetKey,
    draftMemberIds,
    draftDelegation,
    availableMembers,
    availableWorkflowOptions,
    validationErrors,
    setIsEditing,
    setIsExpanded,
    setMemberToAdd,
    setDelegationToAdd,
    addDraftMember,
    removeDraftMember,
    addDelegation,
    removeDelegation,
    addWorkflowTypes,
    removeWorkflowType,
    handleSave,
    handleCancel,
  };
}
