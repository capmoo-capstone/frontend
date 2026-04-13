import { useCallback, useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Trash2, UserPlus, Users, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { type ProcurementRoleSetting, type SettingsUserOption } from '@/features/settings/types';
import {
  type UserRole,
  UserSelect,
  useUpdateSupplyRole,
  useAddDelegation,
  useCancelDelegation,
  useUpdateUserRole,
  useUsersForSelection,
} from '@/features/users';
import { formatDateThaiShort } from '@/lib/formatters';

import { SUPPLY_OPERATION_DEPARTMENT_ID } from '../../constants';
import { PROCUREMENT_ROLES_CONFIG } from '../../constants';
import { useProcurementRoleEditor } from '../../hooks/useProcurementRoleEditor';
import { DelegationFormSection } from '../DelegationFormSection';
import { InlineActionRow } from '../InlineActionRow';

export function ProcurementStaffManager() {
  const { data: procurementUsersResponse, isPending } = useUsersForSelection({
    deptId: SUPPLY_OPERATION_DEPARTMENT_ID,
  });
  const addDelegationMutation = useAddDelegation();
  const cancelDelegationMutation = useCancelDelegation();
  const updateSupplyRole = useUpdateSupplyRole();

  const queryClient = useQueryClient();

  const procurementUsers = procurementUsersResponse?.data ?? [];

  const procurementRoles = useMemo<ProcurementRoleSetting[]>(() => {
    return PROCUREMENT_ROLES_CONFIG.map((config) => {
      // NOTE: Make sure this matches your JSON! In the previous data you shared,
      // "roles" was an array. If so, this should be: user.roles?.includes(config.role)
      const membersWithRole = procurementUsers.filter((user) => user.role === config.role);

      return {
        id: config.role,
        label: config.label,
        member_ids: membersWithRole.map((u) => u.id),
        allow_multiple: config.allowMultiple,
        delegation: [],
      };
    });
  }, [procurementUsers]);

  const submitRoleChanges = useCallback(
    async (_updatedRole: ProcurementRoleSetting) => {
      const current = procurementRoles.find((role) => role.id === _updatedRole.id);

      if (!current) {
        console.error('Current role data not found for id:', _updatedRole.id);
        return;
      }

      if (_updatedRole.id === 'HEAD_OF_DEPARTMENT') {
        if (_updatedRole.delegation.length > 0 && current.delegation) {
          await addDelegationMutation.mutateAsync({
            delegatorId: _updatedRole.member_ids[0],
            delegateeId: _updatedRole.delegation[0].user_id,
            startDate: _updatedRole.delegation[0].start_date,
            endDate: _updatedRole.delegation[0].end_date,
          });
        } else if (_updatedRole.delegation.length === 0 && current.delegation[0]) {
          await cancelDelegationMutation.mutateAsync({
            delegationId: current.delegation[0].id!,
          });
        }
      }

      const newUserIds = _updatedRole.member_ids.filter(
        (id) => !current.member_ids.includes(id)
      ) ?? [];
      const removeUserIds = current.member_ids.filter(
        (id) => !_updatedRole.member_ids.includes(id)
      ) ?? [];

      if (newUserIds.length > 0 || removeUserIds.length > 0) {
        await updateSupplyRole.mutateAsync({
          role: _updatedRole.id as UserRole,
          newUserIds,
          removeUserIds,
        });
      }
    },
    [
      procurementRoles,
      addDelegationMutation,
      cancelDelegationMutation,
      updateSupplyRole,
      queryClient,
    ]
  );

  if (isPending) {
    return (
      <div className="text-muted-foreground p-5 text-center">กำลังโหลดข้อมูลเจ้าหน้าที่...</div>
    );
  }

  return (
    <>
      <header className="space-y-3">
        <h1 className="h1-topic text-primary">ตั้งค่าเจ้าหน้าที่พัสดุ</h1>
      </header>

      <section className="border-border rounded-lg border bg-white p-5">
        <h2 className="h2-topic flex items-center">
          <Users className="mr-2 h-6 w-6" />
          เจ้าหน้าที่พัสดุ
        </h2>

        <div className="divide-y">
          {procurementRoles.map((role) => (
            <RoleRow
              key={role.id}
              role={role}
              allRoles={procurementRoles}
              people={procurementUsers}
              onSave={submitRoleChanges}
            />
          ))}
        </div>
      </section>
    </>
  );
}

interface RoleRowProps {
  role: ProcurementRoleSetting;
  allRoles: ProcurementRoleSetting[];
  people: SettingsUserOption[];
  onSave: (role: ProcurementRoleSetting) => void;
}

function RoleRow({ role, allRoles, people, onSave }: RoleRowProps) {
  const getPersonNameById = (id: string) =>
    people.find((person) => person.id === id)?.full_name || '-';

  const {
    delegationToAdd,
    delegationFormResetKey,
    directorMemberId,
    draftDelegations,
    draftMemberIds,
    error,
    isDirectorRole,
    isEditing,
    memberToAdd,
    selectedNames,
    setDelegationToAdd,
    setMemberToAdd,
    handleAddMember,
    handleAddDelegation,
    handleCancel,
    handleEdit,
    handleRemoveDelegation,
    handleRemoveMember,
    handleSetDirectorMember,
    handleSave,
  } = useProcurementRoleEditor({ role, allRoles, getPersonNameById, onSave });

  return (
    <article className="py-1">
      <InlineActionRow
        label={role.label}
        isEditing={isEditing}
        viewContent={
          <RoleViewContent
            selectedNames={selectedNames}
            isDirectorRole={isDirectorRole}
            delegations={role.delegation}
            getPersonNameById={getPersonNameById}
          />
        }
        editContent={
          <div className="space-y-3 py-1">
            {isDirectorRole ? (
              <DirectorRoleEditContent
                currentDirectorId={role.member_ids[0] ?? ''}
                directorMemberId={directorMemberId}
                draftDelegations={draftDelegations}
                delegationToAdd={delegationToAdd}
                delegationFormResetKey={delegationFormResetKey}
                people={people}
                getPersonNameById={getPersonNameById}
                onSetDirectorMember={handleSetDirectorMember}
                onSetDelegationToAdd={setDelegationToAdd}
                onAddDelegation={handleAddDelegation}
                onRemoveDelegation={handleRemoveDelegation}
              />
            ) : (
              <MemberRoleEditContent
                memberToAdd={memberToAdd}
                draftMemberIds={draftMemberIds}
                people={people}
                getPersonNameById={getPersonNameById}
                onSetMemberToAdd={setMemberToAdd}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
              />
            )}

            {error && <p className="caption text-error">{error}</p>}
          </div>
        }
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </article>
  );
}

interface RoleViewContentProps {
  selectedNames: string;
  isDirectorRole: boolean;
  delegations: ProcurementRoleSetting['delegation'];
  getPersonNameById: (id: string) => string;
}

function RoleViewContent({
  selectedNames,
  isDirectorRole,
  delegations,
  getPersonNameById,
}: RoleViewContentProps) {
  return (
    <section className="space-y-2 py-1">
      <p>{selectedNames}</p>
      {isDirectorRole &&
        delegations.map((delegation, index) => (
          <p key={`${delegation.user_id}-${index}`} className="text-muted-foreground caption">
            รักษาการโดย {getPersonNameById(delegation.user_id)} เริ่ม{' '}
            {formatDateThaiShort(delegation.start_date)} สิ้นสุด{' '}
            {formatDateThaiShort(delegation.end_date)}
          </p>
        ))}
    </section>
  );
}

interface DirectorRoleEditContentProps {
  currentDirectorId: string;
  directorMemberId: string;
  draftDelegations: ProcurementRoleSetting['delegation'];
  delegationToAdd: ProcurementRoleSetting['delegation'][number] | null;
  delegationFormResetKey: number;
  people: SettingsUserOption[];
  getPersonNameById: (id: string) => string;
  onSetDirectorMember: (id: string) => void;
  onSetDelegationToAdd: (delegation: ProcurementRoleSetting['delegation'][number] | null) => void;
  onAddDelegation: () => void;
  onRemoveDelegation: (index: number) => void;
}

function DirectorRoleEditContent({
  currentDirectorId,
  directorMemberId,
  draftDelegations,
  delegationToAdd,
  delegationFormResetKey,
  people,
  getPersonNameById,
  onSetDirectorMember,
  onSetDelegationToAdd,
  onAddDelegation,
  onRemoveDelegation,
}: DirectorRoleEditContentProps) {
  return (
    <>
      <section className="space-y-1">
        <p className="text-primary normal-b">ผู้อำนวยการ</p>
        <p className="text-muted-foreground caption">
          ปัจจุบัน: {getPersonNameById(currentDirectorId)}
        </p>
        <UserSelect
          value={directorMemberId}
          deptId="procurement"
          options={people}
          placeholder="กรุณาเลือกหัวหน้าพัสดุ"
          onChange={onSetDirectorMember}
          className="w-xs max-w-xs min-w-xs"
          hasClearButton={false}
        />
      </section>

      <section className="space-y-2">
        {draftDelegations.length > 0 ? (
          <>
            <p className="text-primary normal-b">การมอบหมายรักษาการ</p>

            {draftDelegations.map((delegation, index) => (
              <article
                key={`${delegation.user_id}-${index}`}
                className="border-border space-y-2 rounded-md border bg-white p-3"
              >
                <p className="text-primary normal">
                  ผู้แทนปัจจุบัน: {getPersonNameById(delegation.user_id)}
                </p>
                <p className="text-muted-foreground caption">
                  เริ่ม {formatDateThaiShort(delegation.start_date)}
                  {` สิ้นสุด ${formatDateThaiShort(delegation.end_date)}`}
                </p>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onRemoveDelegation(index)}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> ลบการมอบหมาย
                </Button>
              </article>
            ))}
          </>
        ) : (
          <>
            <p className="text-primary normal-b">สร้างการมอบหมาย</p>

            <DelegationFormSection
              value={delegationToAdd}
              onChange={onSetDelegationToAdd}
              people={people}
              resetKey={delegationFormResetKey}
            />
            <Button
              type="button"
              variant="outline"
              onClick={onAddDelegation}
              disabled={!delegationToAdd}
            >
              <UserPlus className="mr-1 h-4 w-4" /> เพิ่มการมอบหมาย
            </Button>
          </>
        )}
      </section>
    </>
  );
}

interface MemberRoleEditContentProps {
  memberToAdd: string;
  draftMemberIds: string[];
  people: SettingsUserOption[];
  getPersonNameById: (id: string) => string;
  onSetMemberToAdd: (id: string) => void;
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
}

function MemberRoleEditContent({
  memberToAdd,
  draftMemberIds,
  people,
  getPersonNameById,
  onSetMemberToAdd,
  onAddMember,
  onRemoveMember,
}: MemberRoleEditContentProps) {
  return (
    <>
      <section className="flex flex-wrap items-center gap-2">
        <UserSelect
          value={memberToAdd}
          deptId="procurement"
          options={people}
          placeholder="กรุณาเลือกเจ้าหน้าที่"
          onChange={onSetMemberToAdd}
          className="min-w-[320px]"
          hasClearButton={false}
        />
        <Button type="button" variant="outline" onClick={onAddMember} disabled={!memberToAdd}>
          <UserPlus className="mr-1 h-4 w-4" /> เพิ่มสมาชิก
        </Button>
      </section>

      <ul className="flex flex-col gap-2">
        {draftMemberIds.map((memberId) => (
          <li
            key={memberId}
            className="normal flex max-w-sm shrink justify-between gap-4 self-start"
          >
            <span>{getPersonNameById(memberId)}</span>
            <button
              type="button"
              onClick={() => onRemoveMember(memberId)}
              className="text-error flex cursor-pointer flex-row items-center gap-1 hover:underline"
            >
              นำออก
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
