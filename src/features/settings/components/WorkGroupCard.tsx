import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Pencil, Save, Trash2, UserPlus, Users, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DIRECTOR_USER_ID,
  PROCUREMENT_PEOPLE,
  type WorkGroupSetting,
  getPersonNameById,
} from '@/features/settings/mock-data';
import {
  type DelegationPayload,
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

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors: formErrors, isDirty },
  } = useForm<WorkGroupFormInput>({
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
    setDelegationToAdd(null);
    setDelegationFormResetKey((prev) => prev + 1);
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

  const availableWorkflowOptions = useMemo(() => {
    return RESPONSIBLE_SELECT_OPTIONS.filter(
      (option) =>
        !draft.workflow_types.includes(option.value) && !usedWorkflowByOtherGroups.has(option.value)
    );
  }, [draft.workflow_types, usedWorkflowByOtherGroups]);

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
    setDelegationToAdd(null);
    setDelegationFormResetKey((prev) => prev + 1);
    setMemberToAdd('');
    setIsEditing(false);
  };

  const draftDelegation = normalizeDelegation(draft.delegation);

  return (
    <section className="border-border flex flex-col gap-6 rounded-md border bg-white p-6">
      <div className="flex flex-wrap-reverse items-start justify-between gap-3">
        {!isEditing ? (
          <div className="h2-topic flex items-center">
            <Users className="mr-2 h-6 w-6" />
            {group.name}
          </div>
        ) : (
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <div className="space-y-1">
                <Input
                  {...field}
                  placeholder="ชื่อกลุ่มงาน"
                  className="min-w-115"
                  aria-invalid={Boolean(formErrors.name)}
                />
                {formErrors.name?.message && (
                  <p className="caption text-error">{formErrors.name.message}</p>
                )}
              </div>
            )}
          />
        )}

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                size="sm"
                variant="brand"
                onClick={handleSave}
                disabled={!isDirty}
              >
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

      {/* Workflow Types */}
      <div className="flex flex-wrap items-start gap-3">
        <span className="normal-b min-w-27.5 pt-1">ประเภทวิธีการจัดหา</span>
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
            availableOptions={availableWorkflowOptions}
            onAddMany={(typesToAdd) => {
              const nextTypes = Array.from(new Set([...draft.workflow_types, ...typesToAdd]));
              setValue('workflow_types', nextTypes, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          />
        </div>
      </div>

      {/* Head */}
      <div className="flex flex-wrap items-start gap-3">
        <span className="normal-b min-w-27.5 pt-2">หัวหน้ากลุ่มงาน</span>
        <div className="flex-1 space-y-2">
          {isEditing ? (
            <div className="space-y-3 py-1">
              <div className="space-y-1">
                <p className="text-primary normal-b">หัวหน้ากลุ่มงาน</p>
                <p className="text-muted-foreground caption">
                  ปัจจุบัน: {getPersonNameById(group.head_id)}
                </p>
                <Controller
                  control={control}
                  name="head_id"
                  render={({ field }) => (
                    <UserSelect
                      value={field.value}
                      deptId="procurement"
                      options={PROCUREMENT_PEOPLE.filter(
                        (person) => person.id !== DIRECTOR_USER_ID
                      )}
                      onChange={field.onChange}
                      className="min-w-[320px]"
                      hasClearButton={false}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                {draftDelegation ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-primary normal-b">การมอบหมายรักษาการ</p>
                    </div>

                    <div className="border-border space-y-2 rounded-md border bg-white p-3">
                      <p className="text-primary normal">
                        ผู้แทนปัจจุบัน: {getPersonNameById(draftDelegation.user_id)}
                      </p>
                      <p className="text-muted-foreground caption">
                        เริ่ม {formatDateThaiShort(draftDelegation.start_date)}
                        {draftDelegation.end_date
                          ? ` สิ้นสุด ${formatDateThaiShort(draftDelegation.end_date)}`
                          : ' (ไม่กำหนดวันที่สิ้นสุด)'}
                      </p>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          setValue('delegation', null, { shouldDirty: true });
                          setDelegationToAdd(null);
                          setDelegationFormResetKey((prev) => prev + 1);
                        }}
                      >
                        <Trash2 className="mr-1 h-4 w-4" /> ลบการมอบหมาย
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-primary normal-b">สร้างการมอบหมาย</p>
                    </div>

                    <DelegationFormSection
                      value={delegationToAdd}
                      onChange={setDelegationToAdd}
                      people={PROCUREMENT_PEOPLE}
                      resetKey={delegationFormResetKey}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (!delegationToAdd) return;
                        setValue('delegation', delegationToAdd, { shouldDirty: true });
                        setDelegationToAdd(null);
                        setDelegationFormResetKey((prev) => prev + 1);
                      }}
                      disabled={!delegationToAdd}
                    >
                      <UserPlus className="mr-1 h-4 w-4" /> เพิ่มการมอบหมาย
                    </Button>
                  </>
                )}
              </div>
            </div>
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
        </div>
      </div>

      {/* Members */}
      <div>
        <button
          type="button"
          className="normal-b mb-2 flex items-center gap-2"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          เจ้าหน้าที่ ({draftMemberIds.length})
          <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
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
                  className="min-w-[320px]"
                  hasClearButton={false}
                />
                <Button
                  type="button"
                  variant="brand"
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
                  <UserPlus className="h-4 w-4" /> เพิ่มเจ้าหน้าที่เข้ากลุ่มงาน
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
    </section>
  );
}
