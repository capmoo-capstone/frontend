import { useCallback, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUnitDetailsByIds, useUnits, useUpdateUnit } from '@/features/organization';
import { type WorkGroupSetting } from '@/features/settings/types';
import {
  useUpdateUsersInUnit,
  useUsersForSelection,
  useUsersForUnitsSelection,
} from '@/features/users';

import {
  DIRECTOR_ROLE_ID,
  HEAD_OF_UNIT_ROLE_ID,
  SUPPLY_OPERATION_DEPARTMENT_ID,
} from '../../constants';
import { CreateGroupPanel } from './CreateGroupPanel';
import { WorkGroupCard } from './WorkGroupCard';

export function WorkGroupsManager() {
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const queryClient = useQueryClient();

  const { data: units } = useUnits(SUPPLY_OPERATION_DEPARTMENT_ID);
  const updateUnitMutation = useUpdateUnit();
  const updateUsersInUnitMutation = useUpdateUsersInUnit();

  const unitIds = useMemo(() => (units ?? []).map((unit) => unit.id), [units]);
  const unitDetailQueries = useUnitDetailsByIds(unitIds);
  const unitUsersQueries = useUsersForUnitsSelection(unitIds);

  const { data: procurementUsersResponse } = useUsersForSelection({
    deptId: SUPPLY_OPERATION_DEPARTMENT_ID,
  });

  const procurementUsers = procurementUsersResponse?.data ?? [];
  const directorUserId = useMemo(
    () => procurementUsers.find((user) => user.role === DIRECTOR_ROLE_ID)?.id,
    [procurementUsers]
  );

  const groups = useMemo<WorkGroupSetting[]>(() => {
    if (!units) return [];

    return units.map((unit, index) => {
      const detail = unitDetailQueries[index]?.data;
      const users = unitUsersQueries[index]?.data?.data ?? [];
      const headId = users.find((user) => user.role === HEAD_OF_UNIT_ROLE_ID)?.id ?? '';

      return {
        id: unit.id,
        name: unit.name,
        workflow_types: detail?.type ?? [],
        head_id: headId,
        member_ids: users.filter((user) => user.id !== headId).map((user) => user.id),
        delegation: null, // TODO: Replace with real delegation fetching hook when available
      };
    });
  }, [units, unitDetailQueries, unitUsersQueries]);

  const handleSaveGroup = useCallback(
    async (updated: WorkGroupSetting) => {
      try {
        const currentGroup = groups.find((group) => group.id === updated.id);
        if (!currentGroup) {
          throw new Error('GROUP_NOT_FOUND');
        }

        const changedPayload: {
          id: string;
          name?: string;
          type?: string[];
        } = {
          id: updated.id,
        };

        if (updated.name !== currentGroup.name) {
          changedPayload.name = updated.name;
        }

        const isWorkflowTypeChanged =
          updated.workflow_types.length !== currentGroup.workflow_types.length ||
          updated.workflow_types.some((workflowType, index) => {
            return workflowType !== currentGroup.workflow_types[index];
          });

        if (isWorkflowTypeChanged) {
          changedPayload.type = updated.workflow_types;
        }

        if (changedPayload.name !== undefined || changedPayload.type !== undefined) {
          await updateUnitMutation.mutateAsync(changedPayload);
        }

        const currentAssignedUsers = new Set(
          [currentGroup.head_id, ...currentGroup.member_ids].filter(Boolean)
        );
        const nextAssignedUsers = Array.from(
          new Set([updated.head_id, ...updated.member_ids].filter(Boolean))
        );

        const newUserIds = nextAssignedUsers.filter((userId) => !currentAssignedUsers.has(userId));
        const removeUserIds = Array.from(currentAssignedUsers).filter(
          (userId) => !nextAssignedUsers.includes(userId)
        );

        if (newUserIds.length > 0 || removeUserIds.length > 0) {
          await updateUsersInUnitMutation.mutateAsync({
            unitId: updated.id,
            newUserIds,
            removeUserIds,
          });
        }

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['users'] }),
          queryClient.invalidateQueries({ queryKey: ['units'] }),
        ]);

        // TODO: Backend Migration required here.
        // Head role updates and delegation management still need dedicated endpoints.
        // e.g., await updateUnitHeadMutation.mutateAsync(...)
        // e.g., await updateDelegationMutation.mutateAsync(...)

        toast.success('บันทึกกลุ่มงานเรียบร้อยแล้ว');
      } catch (error) {
        toast.error('ไม่สามารถบันทึกกลุ่มงานได้');
        throw error;
      }
    },
    [groups, queryClient, updateUnitMutation, updateUsersInUnitMutation]
  );

  const handleCreateGroup = useCallback((_newGroup: WorkGroupSetting) => {
    // TODO: Connect to actual create unit endpoint
    setIsCreateVisible(false);
  }, []);

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="h1-topic text-primary">ตั้งค่ากลุ่มงาน</h1>

        <Popover open={isCreateVisible} onOpenChange={setIsCreateVisible}>
          <PopoverTrigger asChild>
            <Button variant="secondary" type="button">
              + สร้างกลุ่มงานใหม่
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-lg" align="end">
            <CreateGroupPanel
              groups={groups}
              procurementUsers={procurementUsers ?? []}
              directorUserId={directorUserId}
              onCancel={() => setIsCreateVisible(false)}
              onCreate={handleCreateGroup}
            />
          </PopoverContent>
        </Popover>
      </header>

      <section className="space-y-4">
        {groups.map((group) => (
          <WorkGroupCard
            key={group.id}
            group={group}
            groups={groups}
            procurementUsers={procurementUsers ?? []}
            directorUserId={directorUserId}
            onSave={handleSaveGroup}
          />
        ))}
      </section>
    </>
  );
}
