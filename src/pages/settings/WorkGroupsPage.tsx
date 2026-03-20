import { useMemo, useState } from 'react';

import { ChevronDown, Pencil, Save, UserPlus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserSearchCombobox, WorkflowTags } from '@/features/settings';
import {
  DIRECTOR_USER_ID,
  PROCUREMENT_PEOPLE,
  WORK_GROUP_SETTINGS,
  type WorkGroupSetting,
  getPersonNameById,
} from '@/features/settings/mock-data';
import { createWorkGroupValidationSchema } from '@/features/settings/types';
import { RESPONSIBLE_SELECT_OPTIONS } from '@/lib/formatters';
import { cn } from '@/lib/utils';

import { DelegationFormSection } from './components/DelegationFormSection';

export default function WorkGroupsPage() {
  const [groups, setGroups] = useState<WorkGroupSetting[]>(WORK_GROUP_SETTINGS);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-5 p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900">ตั้งค่ากลุ่มงาน</h1>
        </div>

        <Button type="button" onClick={() => setShowCreate((prev) => !prev)}>
          + สร้างกลุ่มงานใหม่
        </Button>
      </header>

      <div className={cn('grid gap-4', showCreate ? 'lg:grid-cols-[1.8fr_1fr]' : 'grid-cols-1')}>
        <div className="space-y-4">
          {groups.map((group) => (
            <WorkGroupCard
              key={group.id}
              group={group}
              groups={groups}
              onSave={(updated) => {
                setGroups((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
              }}
            />
          ))}
        </div>

        {showCreate && (
          <CreateGroupPanel
            groups={groups}
            onCancel={() => setShowCreate(false)}
            onCreate={(newGroup) => {
              setGroups((prev) => [newGroup, ...prev]);
              setShowCreate(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

interface WorkGroupCardProps {
  group: WorkGroupSetting;
  groups: WorkGroupSetting[];
  onSave: (group: WorkGroupSetting) => void;
}

function WorkGroupCard({ group, groups, onSave }: WorkGroupCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [draft, setDraft] = useState<WorkGroupSetting>(group);
  const [memberToAdd, setMemberToAdd] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [showDelegation, setShowDelegation] = useState(!!group.delegation);

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

  const validateDraft = (value: WorkGroupSetting) => {
    const schema = createWorkGroupValidationSchema({
      currentGroupId: group.id,
      existingGroups: groups,
      directorUserId: DIRECTOR_USER_ID,
    });

    const parsed = schema.safeParse(value);
    if (parsed.success) {
      setErrors([]);
      return true;
    }

    setErrors(Array.from(new Set(parsed.error.issues.map((issue) => issue.message))));
    return false;
  };

  const save = () => {
    if (!validateDraft(draft)) return;

    if (draft.delegation?.user_id) {
      const isHeadElsewhere = groups
        .filter((item) => item.id !== group.id)
        .some((item) => item.head_id === draft.delegation?.user_id);

      if (isHeadElsewhere) {
        const ok = window.confirm(
          'ผู้แทนที่เลือกเป็นหัวหน้ากลุ่มงานอื่นอยู่แล้ว ต้องการยืนยันการแต่งตั้งหรือไม่?'
        );
        if (!ok) return;
      }
    }

    onSave(draft);
    setIsEditing(false);
  };

  const cancel = () => {
    setDraft(group);
    setShowDelegation(!!group.delegation);
    setMemberToAdd('');
    setErrors([]);
    setIsEditing(false);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        {!isEditing ? (
          <h2 className="line-clamp-1 text-xl font-bold text-slate-900">{group.name}</h2>
        ) : (
          <Input
            value={draft.name}
            onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="ชื่อกลุ่มงาน"
            className="max-w-115"
          />
        )}

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button type="button" size="sm" onClick={save}>
                <Save className="mr-1 h-4 w-4" /> บันทึก
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={cancel}>
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
          <span className="min-w-27.5 pt-1 text-sm font-semibold">ประเภทวิธีการจัดหา *</span>
          <div className="flex-1 space-y-2">
            <WorkflowTags
              types={draft.workflow_types}
              isEditing={isEditing}
              onRemove={(type) =>
                setDraft((prev) => ({
                  ...prev,
                  workflow_types: prev.workflow_types.filter((item) => item !== type),
                }))
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
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        workflow_types: [...prev.workflow_types, option.value],
                      }))
                    }
                  >
                    + {option.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-3">
          <span className="min-w-27.5 pt-2 text-sm font-semibold">หัวหน้ากลุ่มงาน *</span>
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <UserSearchCombobox
                value={draft.head_id}
                departmentId="procurement"
                options={PROCUREMENT_PEOPLE.filter((person) => person.id !== DIRECTOR_USER_ID)}
                onChange={(id) => setDraft((prev) => ({ ...prev, head_id: id }))}
                className="max-w-95"
              />
            ) : (
              <p className="pt-2 text-sm text-slate-700">
                {getPersonNameById(group.head_id)}
                {group.delegation?.user_id && group.delegation.start_date && (
                  <span className="ml-2 text-xs text-slate-500">
                    (รักษาการแทนโดย {getPersonNameById(group.delegation.user_id)} เริ่ม
                    {formatThaiDate(group.delegation.start_date)})
                  </span>
                )}
              </p>
            )}

            {isEditing && (
              <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDelegation((prev) => !prev);
                    if (!showDelegation) {
                      setDraft((prev) => ({
                        ...prev,
                        delegation: prev.delegation || {
                          user_id: '',
                          start_date: undefined,
                          end_date: undefined,
                          is_permanent: false,
                        },
                      }));
                    }
                  }}
                >
                  <UserPlus className="mr-1 h-4 w-4" />{' '}
                  {showDelegation ? 'ยกเลิกผู้แทน' : 'ลงผู้แทน'}
                </Button>

                {showDelegation && (
                  <DelegationFormSection
                    value={draft.delegation}
                    onChange={(payload) => setDraft((prev) => ({ ...prev, delegation: payload }))}
                    people={PROCUREMENT_PEOPLE}
                    roleContext="group-head"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            type="button"
            className="mb-2 flex items-center gap-2 text-sm font-semibold"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            เจ้าหน้าที่ ({draft.member_ids.length})
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
            />
          </button>

          {isExpanded && (
            <div className="space-y-2">
              {isEditing && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <UserSearchCombobox
                    value={memberToAdd}
                    departmentId="procurement"
                    options={availableMembers}
                    onChange={(id) => setMemberToAdd(id)}
                    className="max-w-[320px]"
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
                      if (draft.member_ids.includes(memberToAdd)) return;

                      setDraft((prev) => ({
                        ...prev,
                        member_ids: [...prev.member_ids, memberToAdd],
                      }));
                      setMemberToAdd('');
                    }}
                  >
                    <UserPlus className="mr-1 h-4 w-4" /> เพิ่มเจ้าหน้าที่เข้ากลุ่มงาน
                  </Button>
                </div>
              )}

              <ul className="divide-y rounded-md border border-slate-200">
                {draft.member_ids.map((memberId) => (
                  <li
                    key={memberId}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <span>{getPersonNameById(memberId)}</span>
                    {isEditing && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            member_ids: prev.member_ids.filter((id) => id !== memberId),
                          }))
                        }
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

        {errors.length > 0 && (
          <div className="space-y-1 text-xs text-red-500">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface CreateGroupPanelProps {
  groups: WorkGroupSetting[];
  onCancel: () => void;
  onCreate: (group: WorkGroupSetting) => void;
}

function CreateGroupPanel({ groups, onCancel, onCreate }: CreateGroupPanelProps) {
  const [draft, setDraft] = useState<WorkGroupSetting>({
    id: `wg-${Date.now()}`,
    name: '',
    workflow_types: [],
    head_id: '',
    member_ids: [],
    delegation: null,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const usedWorkflowTypes = useMemo(
    () => new Set(groups.flatMap((group) => group.workflow_types)),
    [groups]
  );

  const create = () => {
    const schema = createWorkGroupValidationSchema({
      currentGroupId: undefined,
      existingGroups: groups,
      directorUserId: DIRECTOR_USER_ID,
    });
    const parsed = schema.safeParse(draft);

    if (!parsed.success) {
      setErrors(Array.from(new Set(parsed.error.issues.map((issue) => issue.message))));
      return;
    }

    setErrors([]);

    onCreate(draft);
  };

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-4 text-xl font-semibold text-slate-900">เพิ่มกลุ่มงาน</h3>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold">ชื่อกลุ่มงาน *</label>
          <Input
            value={draft.name}
            onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="กรุณากรอกชื่อกลุ่มงาน"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold">ประเภทวิธีการจัดหา *</label>
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
                    'rounded-md border px-2.5 py-1 text-sm',
                    isSelected
                      ? 'border-pink-300 bg-pink-50 text-pink-700'
                      : 'border-slate-200 bg-white text-slate-700'
                  )}
                  onClick={() => {
                    setDraft((prev) => ({
                      ...prev,
                      workflow_types: isSelected
                        ? prev.workflow_types.filter((item) => item !== option.value)
                        : [...prev.workflow_types, option.value],
                    }));
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold">หัวหน้ากลุ่มงาน *</label>
          <UserSearchCombobox
            value={draft.head_id}
            departmentId="procurement"
            options={PROCUREMENT_PEOPLE.filter((person) => person.id !== DIRECTOR_USER_ID)}
            onChange={(id) => setDraft((prev) => ({ ...prev, head_id: id }))}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" onClick={create}>
            <Save className="mr-1 h-4 w-4" /> สร้างกลุ่มงาน
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-1 h-4 w-4" /> ยกเลิก
          </Button>
        </div>

        {errors.length > 0 && (
          <div className="space-y-1 text-xs text-red-500">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

const formatThaiDate = (date?: Date) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};
