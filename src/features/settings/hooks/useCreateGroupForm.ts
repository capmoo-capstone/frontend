import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { RESPONSIBLE_SELECT_OPTIONS } from '@/features/projects';

import {
  type DelegationPayload,
  type WorkGroupFormInput,
  type WorkGroupSetting,
  createWorkGroupValidationSchema,
} from '../types';

interface UseCreateGroupFormParams {
  groups: WorkGroupSetting[];
  directorUserId?: string;
  onCreate: (group: WorkGroupSetting) => void;
}

const normalizeDelegation = (
  delegation: Partial<DelegationPayload> | null | undefined
): DelegationPayload | null => {
  if (!delegation?.user_id || !delegation.start_date || !delegation.end_date) {
    return null;
  }

  return {
    id: delegation.id,
    user_id: delegation.user_id,
    start_date: delegation.start_date,
    end_date: delegation.end_date,
  };
};

export function useCreateGroupForm({ groups, directorUserId, onCreate }: UseCreateGroupFormParams) {
  // TODO (BACKEND MIGRATION): Group creation validation and uniqueness constraints should be validated server-side to prevent race conditions across clients.
  const createGroupValidationSchema = useMemo(
    () =>
      createWorkGroupValidationSchema({
        currentGroupId: undefined,
        existingGroups: groups,
        directorUserId: directorUserId ?? '',
      }),
    [directorUserId, groups]
  );

  const form = useForm<WorkGroupFormInput>({
    resolver: zodResolver(createGroupValidationSchema),
    defaultValues: {
      name: '',
      workflow_types: [],
      head_id: '',
      member_ids: [],
      delegation: null,
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const watchedDraft = useWatch({ control: form.control });
  const draft: WorkGroupFormInput = {
    name: watchedDraft.name ?? '',
    workflow_types: watchedDraft.workflow_types ?? [],
    head_id: watchedDraft.head_id ?? '',
    member_ids: watchedDraft.member_ids ?? [],
    delegation: normalizeDelegation(watchedDraft.delegation),
  };
  const [newGroupId] = useState(() => `wg-${Date.now()}`);

  const usedWorkflowTypes = useMemo(
    () => new Set(groups.flatMap((group) => group.workflow_types)),
    [groups]
  );

  const availableWorkflowOptions = useMemo(
    () => RESPONSIBLE_SELECT_OPTIONS.filter((option) => !usedWorkflowTypes.has(option.value)),
    [usedWorkflowTypes]
  );

  const duplicateHeadWarning = useMemo(() => {
    if (!draft.head_id) return undefined;
    const isDuplicate = groups.some((group) => group.head_id === draft.head_id);
    return isDuplicate ? 'หัวหน้างานที่เลือกซ้ำกับกลุ่มงานอื่น' : undefined;
  }, [draft.head_id, groups]);

  const toggleWorkflowType = (type: string) => {
    const isSelected = draft.workflow_types.includes(type);
    const nextTypes = isSelected
      ? draft.workflow_types.filter((item) => item !== type)
      : [...draft.workflow_types, type];

    form.setValue('workflow_types', nextTypes, { shouldDirty: true, shouldValidate: true });
  };

  const submitCreate = form.handleSubmit((values) => {
    onCreate({
      id: newGroupId,
      ...values,
      member_ids: values.member_ids ?? [],
      delegation: values.delegation ?? null,
    });
  });

  const isCreateReady =
    draft.name.trim().length > 0 && draft.workflow_types.length > 0 && draft.head_id.length > 0;

  return {
    draft,
    form,
    availableWorkflowOptions,
    duplicateHeadWarning,
    submitCreate,
    toggleWorkflowType,
    isSubmitDisabled: !isCreateReady,
  };
}
