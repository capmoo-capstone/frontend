import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { type WorkGroupSetting } from '@/features/settings/types';
import {
  type DelegationPayload,
  type SettingsUserOption,
  type WorkGroupFormInput,
  createWorkGroupValidationSchema,
} from '@/features/settings/types';
import { RESPONSIBLE_SELECT_OPTIONS } from '@/lib/formatters';

import { getFormErrorMessages } from '../components/work-group/workGroupFormUtils';
import { useDelegationFormReset } from './useDelegationFormReset';

interface UseWorkGroupCardEditorParams {
  group: WorkGroupSetting;
  groups: WorkGroupSetting[];
  procurementUsers: SettingsUserOption[];
  directorUserId?: string;
  onSave: (group: WorkGroupSetting) => void | Promise<void>;
}

export function useWorkGroupCardEditor({
  group,
  groups,
  procurementUsers,
  directorUserId,
  onSave,
}: UseWorkGroupCardEditorParams) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [memberToAdd, setMemberToAdd] = useState('');
  const [delegationToAdd, setDelegationToAdd] = useState<DelegationPayload | null>(null);
  const { delegationFormResetKey, bumpDelegationFormResetKey } = useDelegationFormReset();

  const form = useForm<WorkGroupFormInput>({
    resolver: zodResolver(
      createWorkGroupValidationSchema({
        currentGroupId: group.id,
        existingGroups: groups,
        directorUserId: directorUserId ?? '',
      })
    ),
    mode: 'onBlur',
    defaultValues: {
      name: group.name,
      workflow_types: group.workflow_types,
      head_id: group.head_id,
      member_ids: group.member_ids,
      delegation: group.delegation,
    },
  });

  const draft = form.watch();
  const validationErrors = useMemo(
    () => getFormErrorMessages(form.formState.errors),
    [form.formState.errors]
  );

  const resetFormToGroupData = () => {
    form.reset({ ...group });
    setDelegationToAdd(null);
    bumpDelegationFormResetKey();
  };

  useEffect(() => {
    resetFormToGroupData();
  }, [group]);

  // Enforce staff uniqueness: Cannot be director, cannot be in ANY other group
  const availableMembers = useMemo(() => {
    const assignedElsewhereIds = new Set(
      groups.filter((g) => g.id !== group.id).flatMap((g) => [g.head_id, ...g.member_ids])
    );

    return procurementUsers.filter((person) => {
      if (person.role === 'DIRECTOR' || person.id === directorUserId) return false;
      if (assignedElsewhereIds.has(person.id)) return false;
      return true;
    });
  }, [directorUserId, group.id, groups, procurementUsers]);

  const usedWorkflowByOtherGroups = useMemo(
    () => new Set(groups.filter((g) => g.id !== group.id).flatMap((g) => g.workflow_types)),
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

  const addWorkflowTypes = (typesToAdd: string[]) => {
    form.setValue('workflow_types', Array.from(new Set([...draft.workflow_types, ...typesToAdd])), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeWorkflowType = (type: string) => {
    form.setValue(
      'workflow_types',
      draft.workflow_types.filter((t) => t !== type),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const addDraftMember = () => {
    if (!memberToAdd || draft.member_ids?.includes(memberToAdd)) return;
    form.setValue('member_ids', [...(draft.member_ids ?? []), memberToAdd], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setMemberToAdd('');
  };

  const removeDraftMember = (memberId: string) => {
    form.setValue(
      'member_ids',
      (draft.member_ids ?? []).filter((id) => id !== memberId),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const handleDelegationAction = (action: 'add' | 'remove') => {
    form.setValue('delegation', action === 'add' ? delegationToAdd : null, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setDelegationToAdd(null);
    bumpDelegationFormResetKey();
  };

  const handleSave = form.handleSubmit(async (values) => {
    // Cross-group acting head validation
    if (values.delegation?.user_id) {
      const isHeadElsewhere = groups.some(
        (g) => g.id !== group.id && g.head_id === values.delegation?.user_id
      );
      if (
        isHeadElsewhere &&
        !window.confirm(
          'ผู้แทนที่เลือกเป็นหัวหน้ากลุ่มงานอื่นอยู่แล้ว ต้องการยืนยันการแต่งตั้งหรือไม่?'
        )
      ) {
        return;
      }
    }

    try {
      await onSave({
        ...group,
        ...values,
        member_ids: values.member_ids ?? [],
        delegation: values.delegation ?? null,
      });
      setIsEditing(false);
    } catch {
      // Intentional empty catch to allow retry
    }
  });

  const handleCancel = () => {
    resetFormToGroupData();
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
    availableMembers,
    availableWorkflowOptions,
    validationErrors,
    setIsEditing,
    setIsExpanded,
    setMemberToAdd,
    setDelegationToAdd,
    addDraftMember,
    removeDraftMember,
    addDelegation: () => handleDelegationAction('add'),
    removeDelegation: () => handleDelegationAction('remove'),
    addWorkflowTypes,
    removeWorkflowType,
    handleSave,
    handleCancel,
  };
}
