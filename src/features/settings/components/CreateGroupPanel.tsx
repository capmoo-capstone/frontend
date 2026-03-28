import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DIRECTOR_USER_ID,
  PROCUREMENT_PEOPLE,
  type WorkGroupSetting,
} from '@/features/settings/mock-data';
import {
  type WorkGroupFormInput,
  createWorkGroupValidationSchema,
} from '@/features/settings/types';
import { UserSelect } from '@/features/users/components/UserSelect';
import { RESPONSIBLE_SELECT_OPTIONS } from '@/lib/formatters';
import { cn } from '@/lib/utils';

import { normalizeDelegation } from './workGroupFormUtils';

interface CreateGroupPanelProps {
  groups: WorkGroupSetting[];
  onCancel: () => void;
  onCreate: (group: WorkGroupSetting) => void;
}

export function CreateGroupPanel({ groups, onCancel, onCreate }: CreateGroupPanelProps) {
  const createGroupValidationSchema = useMemo(
    () =>
      createWorkGroupValidationSchema({
        currentGroupId: undefined,
        existingGroups: groups,
        directorUserId: DIRECTOR_USER_ID,
      }),
    [groups]
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors, touchedFields },
  } = useForm<WorkGroupFormInput>({
    resolver: zodResolver(createGroupValidationSchema),
    defaultValues: {
      name: '',
      workflow_types: [],
      head_id: '',
      member_ids: [],
      delegation: null,
    },
  });

  const draft = watch();
  const [newGroupId] = useState(() => `wg-${Date.now()}`);

  const usedWorkflowTypes = useMemo(
    () => new Set(groups.flatMap((group) => group.workflow_types)),
    [groups]
  );

  const duplicateHeadWarning = useMemo(() => {
    if (!draft.head_id) return undefined;
    const isDuplicate = groups.some((group) => group.head_id === draft.head_id);
    return isDuplicate ? 'หัวหน้างานที่เลือกซ้ำกับกลุ่มงานอื่น' : undefined;
  }, [draft.head_id, groups]);

  const handleCreate = handleSubmit((values) => {
    onCreate({
      id: newGroupId,
      ...values,
      member_ids: values.member_ids ?? [],
      delegation: normalizeDelegation(values.delegation),
    });
  });

  return (
    <aside className="rounded-md bg-white">
      <h3 className="text-primary h2-topic mb-4">เพิ่มกลุ่มงาน</h3>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="normal font-semibold">
            ชื่อกลุ่มงาน
            <span className="text-error">*</span>
          </label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="กรุณากรอกชื่อกลุ่มงาน"
                className={cn(formErrors.name && touchedFields.name && 'border-error')}
              />
            )}
          />
          {formErrors.name && touchedFields.name && (
            <p className="caption text-error">กรุณากรอกชื่อกลุ่มงาน</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="normal font-semibold">
            ประเภทวิธีการจัดหา
            <span className="text-error">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {RESPONSIBLE_SELECT_OPTIONS.filter(
              (option) => !usedWorkflowTypes.has(option.value)
            ).map((option) => {
              const isSelected = draft.workflow_types.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'normal cursor-pointer rounded-md border px-2.5 py-1',
                    isSelected
                      ? 'border-brand-6 bg-brand-3 text-brand-11'
                      : 'border-border text-primary bg-white'
                  )}
                  onClick={() => {
                    setValue(
                      'workflow_types',
                      isSelected
                        ? draft.workflow_types.filter((item) => item !== option.value)
                        : [...draft.workflow_types, option.value],
                      { shouldDirty: true }
                    );
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="normal font-semibold">
            หัวหน้ากลุ่มงาน
            <span className="text-error">*</span>
          </label>
          <Controller
            control={control}
            name="head_id"
            render={({ field }) => (
              <UserSelect
                value={field.value}
                deptId="procurement"
                options={PROCUREMENT_PEOPLE.filter((person) => person.id !== DIRECTOR_USER_ID)}
                onChange={field.onChange}
                hasClearButton={false}
                placeholder="กรุณาเลือกหัวหน้ากลุ่มงาน"
                className={cn('min-w-full', formErrors.head_id && 'border-error')}
              />
            )}
          />
          {duplicateHeadWarning && (
            <p className="caption flex items-center gap-1 text-yellow-600">
              {duplicateHeadWarning}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="brand"
            onClick={handleCreate}
            disabled={Object.keys(formErrors).length > 0}
          >
            <Check className="mr-1 h-4 w-4" /> สร้างกลุ่มงาน
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-1 h-4 w-4" /> ยกเลิก
          </Button>
        </div>
      </div>
    </aside>
  );
}
