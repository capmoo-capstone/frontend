import { useMemo } from 'react';
import { Controller } from 'react-hook-form';

import { ChevronDown, Pencil, Save, Trash2, UserPlus, Users, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type WorkGroupSetting } from '@/features/settings/types';
import { type SettingsUserOption } from '@/features/settings/types';
import { UserSelect } from '@/features/users/components/UserSelect';
import { formatDateThaiShort } from '@/lib/formatters';
import { cn } from '@/lib/utils';

import { DIRECTOR_ROLE_ID } from '../../constants';
import { useWorkGroupCardEditor } from '../../hooks/useWorkGroupCardEditor';
import { DelegationFormSection } from '../DelegationFormSection';
import { WorkflowTags } from './WorkflowTags';

interface WorkGroupCardProps {
  group: WorkGroupSetting;
  groups: WorkGroupSetting[];
  procurementUsers: SettingsUserOption[];
  directorUserId?: string;
  onSave: (group: WorkGroupSetting) => void | Promise<void>;
}

export function WorkGroupCard(props: WorkGroupCardProps) {
  const editor = useWorkGroupCardEditor(props);
  const { group, procurementUsers } = props;

  const getDisplayName = useMemo(() => {
    return (id: string) =>
      procurementUsers.find((user) => user.id === id)?.full_name ?? 'ไม่พบข้อมูล';
  }, [procurementUsers]);

  const {
    control,
    formState: { errors, isDirty },
  } = editor.form;
  const draftMemberIds = editor.draft.member_ids ?? [];

  return (
    <section className="border-border flex flex-col gap-6 rounded-md border bg-white p-6">
      <div className="flex flex-wrap-reverse items-end justify-between gap-3">
        {!editor.isEditing ? (
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
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name?.message && (
                  <p className="caption text-error">{errors.name.message}</p>
                )}
              </div>
            )}
          />
        )}

        <div className="flex items-center gap-2">
          {editor.isEditing ? (
            <>
              <Button
                type="button"
                size="sm"
                variant="brand"
                onClick={editor.handleSave}
                disabled={!isDirty}
              >
                <Save className="mr-1 h-4 w-4" /> บันทึก
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={editor.handleCancel}>
                <X className="mr-1 h-4 w-4" /> ยกเลิก
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => editor.setIsEditing(true)}
            >
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
            types={editor.draft.workflow_types}
            isEditing={editor.isEditing}
            onRemove={editor.removeWorkflowType}
            availableOptions={editor.availableWorkflowOptions}
            onAddMany={editor.addWorkflowTypes}
          />
        </div>
      </div>

      {/* Head & Delegation */}
      <div className="flex flex-wrap items-start gap-3">
        <span className="normal-b min-w-27.5 pt-2">หัวหน้ากลุ่มงาน</span>
        <div className="flex-1 space-y-2">
          {editor.isEditing ? (
            <div className="space-y-3 py-1">
              <div className="space-y-1">
                <p className="text-primary normal-b">หัวหน้ากลุ่มงาน</p>
                <p className="text-muted-foreground caption">
                  ปัจจุบัน: {getDisplayName(group.head_id)}
                </p>
                <Controller
                  control={control}
                  name="head_id"
                  render={({ field }) => (
                    <UserSelect
                      value={field.value}
                      deptId="procurement"
                      options={procurementUsers.filter((p) => p.role !== DIRECTOR_ROLE_ID)}
                      onChange={field.onChange}
                      className="min-w-[320px]"
                      hasClearButton={false}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                {editor.draft.delegation ? (
                  <>
                    <p className="text-primary normal-b">การมอบหมายรักษาการ</p>
                    <div className="border-border space-y-2 rounded-md border bg-white p-3">
                      <p className="text-primary normal">
                        ผู้แทนปัจจุบัน: {getDisplayName(editor.draft.delegation.user_id)}
                      </p>
                      <p className="text-muted-foreground caption">
                        เริ่ม {formatDateThaiShort(editor.draft.delegation.start_date)}
                        {` สิ้นสุด ${formatDateThaiShort(editor.draft.delegation.end_date)}`}
                      </p>
                      <Button type="button" variant="destructive" onClick={editor.removeDelegation}>
                        <Trash2 className="mr-1 h-4 w-4" /> ลบการมอบหมาย
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-primary normal-b">สร้างการมอบหมาย</p>
                    <DelegationFormSection
                      value={editor.delegationToAdd}
                      onChange={editor.setDelegationToAdd}
                      people={procurementUsers}
                      resetKey={editor.delegationFormResetKey}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={editor.addDelegation}
                      disabled={!editor.delegationToAdd}
                    >
                      <UserPlus className="mr-1 h-4 w-4" /> เพิ่มการมอบหมาย
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="normal text-primary pt-2">
              {getDisplayName(group.head_id)}
              {group.delegation?.user_id && group.delegation.start_date && (
                <span className="caption text-muted-foreground ml-2">
                  ( รักษาการโดย {getDisplayName(group.delegation.user_id)} เริ่ม{' '}
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
          onClick={() => editor.setIsExpanded(!editor.isExpanded)}
        >
          เจ้าหน้าที่ ({draftMemberIds.length})
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', editor.isExpanded && 'rotate-180')}
          />
        </button>

        {editor.isExpanded && (
          <div className="space-y-2">
            {editor.isEditing && (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <UserSelect
                  value={editor.memberToAdd}
                  deptId="procurement"
                  options={editor.availableMembers}
                  onChange={(id) => editor.setMemberToAdd(id)}
                  className="min-w-[320px]"
                  hasClearButton={false}
                />
                <Button
                  type="button"
                  variant="brand"
                  disabled={
                    !editor.memberToAdd ||
                    !editor.availableMembers.some((p) => p.id === editor.memberToAdd)
                  }
                  onClick={editor.addDraftMember}
                >
                  <UserPlus className="h-4 w-4" /> เพิ่มเจ้าหน้าที่เข้ากลุ่มงาน
                </Button>
              </div>
            )}

            <ul className="divide-y rounded-md border border-slate-200">
              {draftMemberIds.map((memberId) => (
                <li key={memberId} className="normal flex items-center justify-between px-3 py-2">
                  <span>{getDisplayName(memberId)}</span>
                  {editor.isEditing && (
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => editor.removeDraftMember(memberId)}
                    >
                      นำออก
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {editor.validationErrors.length > 0 && (
        <div className="caption space-y-1 text-red-500">
          {editor.validationErrors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
    </section>
  );
}
