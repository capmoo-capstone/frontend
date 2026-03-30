import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  type WorkGroupFormInput,
  type WorkGroupSetting,
  createWorkGroupValidationSchema,
} from '@/features/settings/types';
import { RESPONSIBLE_SELECT_OPTIONS } from '@/lib/formatters';

interface UseCreateGroupFormParams {
  groups: WorkGroupSetting[];
  directorUserId?: string;
  onCreate: (group: WorkGroupSetting) => void;
}

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

  const draft = form.watch();
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
