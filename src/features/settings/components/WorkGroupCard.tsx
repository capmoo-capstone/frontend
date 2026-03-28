import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Pencil, Save, UserPlus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DIRECTOR_USER_ID,
  PROCUREMENT_PEOPLE,
  type WorkGroupSetting,
  getPersonNameById,
} from '@/features/settings/mock-data';
import {
  type WorkGroupFormInput,
  createWorkGroupValidationSchema,
} from '@/features/settings/types';
import { UserSelect } from '@/features/users/components/UserSelect';
import { RESPONSIBLE_SELECT_OPTIONS, formatDateThaiShort } from '@/lib/formatters';
import { cn } from '@/lib/utils';

import { DelegationFormSection } from './DelegationFormSection';
import { WorkflowTags } from './WorkflowTags';
import { getFormErrorMessages, normalizeDelegation } from './workGroupFormUtils';

interface WorkGroupCardProps {
  group: WorkGroupSetting;
  groups: WorkGroupSetting[];
  onSave: (group: WorkGroupSetting) => void;
}

export function WorkGroupCard({ group, groups, onSave }: WorkGroupCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [memberToAdd, setMemberToAdd] = useState('');
  const [isDelegationVisible, setIsDelegationVisible] = useState(!!group.delegation);

  const workGroupValidationSchema = useMemo(
    () =>
      createWorkGroupValidationSchema({
        currentGroupId: group.id,
        existingGroups: groups,
        directorUserId: DIRECTOR_USER_ID,
      }),
    [group.id, groups]
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<WorkGroupFormInput>({
    resolver: zodResolver(workGroupValidationSchema),
    defaultValues: {
      name: group.name,
      workflow_types: group.workflow_types,
      head_id: group.head_id,
      member_ids: group.member_ids,
      delegation: group.delegation,
    },
  });

  const draft = watch();
  const draftMemberIds = draft.member_ids ?? [];

  const validationErrors = useMemo(() => getFormErrorMessages(formErrors), [formErrors]);

  useEffect(() => {
    reset({
      name: group.name,
      workflow_types: group.workflow_types,
      head_id: group.head_id,
      member_ids: group.member_ids,
      delegation: group.delegation,
    });
    setIsDelegationVisible(!!group.delegation);
  }, [group, reset]);

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

  const usedWorkflowByOtherGroups = useMemo(() => {
    return new Set(
      groups.filter((item) => item.id !== group.id).flatMap((item) => item.workflow_types)
    );
  }, [group.id, groups]);

  const handleSave = handleSubmit((values) => {
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
    reset({
      name: group.name,
      workflow_types: group.workflow_types,
      head_id: group.head_id,
      member_ids: group.member_ids,
      delegation: group.delegation,
    });
    setIsDelegationVisible(!!group.delegation);
    setMemberToAdd('');
    setIsEditing(false);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        {!isEditing ? (
          <h2 className="line-clamp-1 text-xl font-bold text-slate-900">{group.name}</h2>
        ) : (
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                value={field.value}
                onChange={field.onChange}
                placeholder="ชื่อกลุ่มงาน"
                className="max-w-115"
              />
            )}
          />
        )}

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button type="button" size="sm" onClick={handleSave}>
                <Save className="mr-1 h-4 w-4" /> บันทึก
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={handleCancel}>
                <X className="mr-1 h-4 w-4" /> ยกเลิก
              </Button>
            </>
          ) : (
            <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="mr-1 h-4 w-4" /> แก้ไขกลุ่มงาน
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-start gap-3">
          <span className="normal min-w-27.5 pt-1 font-semibold">ประเภทวิธีการจัดหา *</span>
          <div className="flex-1 space-y-2">
            <WorkflowTags
              types={draft.workflow_types}
              isEditing={isEditing}
              onRemove={(type) =>
                setValue(
                  'workflow_types',
                  draft.workflow_types.filter((item) => item !== type),
                  { shouldDirty: true }
                )
              }
            />
            {isEditing && (
              <div className="flex flex-wrap gap-2">
                {RESPONSIBLE_SELECT_OPTIONS.filter(
                  (option) =>
                    !draft.workflow_types.includes(option.value) &&
                    !usedWorkflowByOtherGroups.has(option.value)
                ).map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setValue('workflow_types', [...draft.workflow_types, option.value], {
                        shouldDirty: true,
                      });
                    }}
                  >
                    + {option.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-3">
          <span className="normal min-w-27.5 pt-2 font-semibold">หัวหน้ากลุ่มงาน *</span>
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <Controller
                control={control}
                name="head_id"
                render={({ field }) => (
                  <UserSelect
                    value={field.value}
                    deptId="procurement"
                    options={PROCUREMENT_PEOPLE.filter((person) => person.id !== DIRECTOR_USER_ID)}
                    onChange={field.onChange}
                    className="max-w-95"
                    hasClearButton={false}
                  />
                )}
              />
            ) : (
              <p className="normal pt-2 text-slate-700">
                {getPersonNameById(group.head_id)}
                {group.delegation?.user_id && group.delegation.start_date && (
                  <span className="caption ml-2 text-slate-500">
                    (รักษาการแทนโดย {getPersonNameById(group.delegation.user_id)} เริ่ม
                    {formatDateThaiShort(group.delegation.start_date)})
                  </span>
                )}
              </p>
            )}

            {isEditing && (
              <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDelegationVisible((prev) => !prev)}
                >
                  <UserPlus className="mr-1 h-4 w-4" />{' '}
                  {isDelegationVisible ? 'ยกเลิกผู้แทน' : 'ลงผู้แทน'}
                </Button>

                {isDelegationVisible && (
                  <DelegationFormSection
                    value={normalizeDelegation(draft.delegation)}
                    onChange={(payload) =>
                      setValue('delegation', payload, {
                        shouldDirty: true,
                      })
                    }
                    people={PROCUREMENT_PEOPLE}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            type="button"
            className="normal mb-2 flex items-center gap-2 font-semibold"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            เจ้าหน้าที่ ({draftMemberIds.length})
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
            />
          </button>

          {isExpanded && (
            <div className="space-y-2">
              {isEditing && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <UserSelect
                    value={memberToAdd}
                    deptId="procurement"
                    options={availableMembers}
                    onChange={(id) => setMemberToAdd(id)}
                    className="max-w-[320px]"
                    hasClearButton={false}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={
                      !memberToAdd || !availableMembers.some((person) => person.id === memberToAdd)
                    }
                    onClick={() => {
                      if (!memberToAdd) return;
                      if (!availableMembers.some((person) => person.id === memberToAdd)) return;
                      if (draftMemberIds.includes(memberToAdd)) return;

                      setValue('member_ids', [...draftMemberIds, memberToAdd], {
                        shouldDirty: true,
                      });
                      setMemberToAdd('');
                    }}
                  >
                    <UserPlus className="mr-1 h-4 w-4" /> เพิ่มเจ้าหน้าที่เข้ากลุ่มงาน
                  </Button>
                </div>
              )}

              <ul className="divide-y rounded-md border border-slate-200">
                {draftMemberIds.map((memberId) => (
                  <li key={memberId} className="normal flex items-center justify-between px-3 py-2">
                    <span>{getPersonNameById(memberId)}</span>
                    {isEditing && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          setValue(
                            'member_ids',
                            draftMemberIds.filter((id) => id !== memberId),
                            {
                              shouldDirty: true,
                            }
                          );
                        }}
                      >
                        ลบสมาชิก
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {validationErrors.length > 0 && (
          <div className="caption space-y-1 text-red-500">
            {validationErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
