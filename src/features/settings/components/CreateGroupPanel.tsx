import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';

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

import { getFormErrorMessages, normalizeDelegation } from './workGroupFormUtils';

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
    formState: { errors: formErrors },
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

  const validationErrors = useMemo(() => getFormErrorMessages(formErrors), [formErrors]);

  const usedWorkflowTypes = useMemo(
    () => new Set(groups.flatMap((group) => group.workflow_types)),
    [groups]
  );

  const handleCreate = handleSubmit((values) => {
    onCreate({
      id: newGroupId,
      ...values,
      member_ids: values.member_ids ?? [],
      delegation: normalizeDelegation(values.delegation),
    });
  });

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-4 text-xl font-semibold text-slate-900">เพิ่มกลุ่มงาน</h3>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="normal font-semibold">ชื่อกลุ่มงาน *</label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                value={field.value}
                onChange={field.onChange}
                placeholder="กรุณากรอกชื่อกลุ่มงาน"
              />
            )}
          />
        </div>

        <div className="space-y-1">
          <label className="normal font-semibold">ประเภทวิธีการจัดหา *</label>
          <div className="flex flex-wrap gap-2 rounded-md border border-slate-200 p-2">
            {RESPONSIBLE_SELECT_OPTIONS.filter(
              (option) => !usedWorkflowTypes.has(option.value)
            ).map((option) => {
              const isSelected = draft.workflow_types.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'normal rounded-md border px-2.5 py-1',
                    isSelected
                      ? 'border-pink-300 bg-pink-50 text-pink-700'
                      : 'border-slate-200 bg-white text-slate-700'
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

        <div className="space-y-1">
          <label className="normal font-semibold">หัวหน้ากลุ่มงาน *</label>
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
              />
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" onClick={handleCreate}>
            <Save className="mr-1 h-4 w-4" /> สร้างกลุ่มงาน
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-1 h-4 w-4" /> ยกเลิก
          </Button>
        </div>

        {validationErrors.length > 0 && (
          <div className="caption space-y-1 text-red-500">
            {validationErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
