import { Controller } from 'react-hook-form';

import { Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserSelect, hasUserSelectionRole } from '@/features/users';
import { cn } from '@/lib/utils';

import { DIRECTOR_ROLE_ID } from '../../constants';
import { useCreateGroupForm } from '../../hooks/useCreateGroupForm';
import { type SettingsUserOption, type WorkGroupSetting } from '../../types';

interface CreateGroupPanelProps {
  groups: WorkGroupSetting[];
  procurementUsers: SettingsUserOption[];
  directorUserId?: string;
  onCancel: () => void;
  onCreate: (group: WorkGroupSetting) => void;
}

export function CreateGroupPanel({
  groups,
  procurementUsers,
  directorUserId,
  onCancel,
  onCreate,
}: CreateGroupPanelProps) {
  const {
    draft,
    form,
    availableWorkflowOptions,
    duplicateHeadWarning,
    submitCreate,
    toggleWorkflowType,
    isSubmitDisabled,
  } = useCreateGroupForm({ groups, onCreate, directorUserId });

  const {
    control,
    formState: { errors: formErrors, touchedFields },
  } = form;

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
            {availableWorkflowOptions.map((option) => {
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
                  onClick={() => toggleWorkflowType(option.value)}
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
                options={procurementUsers.filter(
                  (person) => !hasUserSelectionRole(person, DIRECTOR_ROLE_ID)
                )}
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
          <Button type="button" variant="brand" onClick={submitCreate} disabled={isSubmitDisabled}>
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
