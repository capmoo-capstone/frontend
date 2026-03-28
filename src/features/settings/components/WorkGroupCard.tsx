import { Controller } from 'react-hook-form';

import { ChevronDown, Pencil, Save, Trash2, UserPlus, Users, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DIRECTOR_USER_ID,
  PROCUREMENT_PEOPLE,
  type WorkGroupSetting,
  getPersonNameById,
} from '@/features/settings/mock-data';
import { UserSelect } from '@/features/users/components/UserSelect';
import { formatDateThaiShort } from '@/lib/formatters';
import { cn } from '@/lib/utils';

import { useWorkGroupCardEditor } from '../hooks/useWorkGroupCardEditor';
import { DelegationFormSection } from './DelegationFormSection';
import { WorkflowTags } from './WorkflowTags';

interface WorkGroupCardProps {
  group: WorkGroupSetting;
  groups: WorkGroupSetting[];
  onSave: (group: WorkGroupSetting) => void;
}

export function WorkGroupCard({ group, groups, onSave }: WorkGroupCardProps) {
  const {
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
  } = useWorkGroupCardEditor({ group, groups, onSave });

  const {
    control,
    formState: { errors: formErrors, isDirty },
  } = form;

  return (
    <section className="border-border flex flex-col gap-6 rounded-md border bg-white p-6">
      <div className="flex flex-wrap-reverse items-end justify-between gap-3">
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
            onRemove={removeWorkflowType}
            availableOptions={availableWorkflowOptions}
            onAddMany={addWorkflowTypes}
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
                      <Button type="button" variant="destructive" onClick={removeDelegation}>
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
                      onClick={addDelegation}
                      disabled={!delegationToAdd}
                    >
                      <UserPlus className="mr-1 h-4 w-4" /> เพิ่มการมอบหมาย
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="normal text-primary pt-2">
              {getPersonNameById(group.head_id)}
              {group.delegation?.user_id && group.delegation.start_date && (
                <span className="caption text-muted-foreground ml-2">
                  ( รักษาการโดย {getPersonNameById(group.delegation.user_id)} เริ่ม{' '}
                  {formatDateThaiShort(group.delegation.start_date)} สิ้นสุด{' '}
                  {formatDateThaiShort(group.delegation.end_date)} )
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
                  onClick={addDraftMember}
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
                      onClick={() => removeDraftMember(memberId)}
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
