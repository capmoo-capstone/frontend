import { useEffect, useMemo, useState } from 'react';

import { Check, ChevronDown, Pencil, Plus, Users, X } from 'lucide-react';
import { toast } from 'sonner';
import { set } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { UserSelect } from '@/components/user-select';
import { useAddUnitMember, useUpdateUnit } from '@/hooks/useUnits';
import { useDelegateUser, useUsersForSelection } from '@/hooks/useUsers';
import type { UnitResponsibleType } from '@/types/project';
import type { Unit } from '@/types/unit';
import type { User, UserSelectionItem } from '@/types/user';

import { DelegateUser } from '../delegate-user';
import { DelegateUserSelect } from '../delegate-user-select';
import { ProjectBadge } from '../project-badge';
import { ProjectTypeSelectButton } from '../project-type-select';
import { UnitTable } from '../unit-table';

export function UnitCard({ unitItem, index }: { unitItem: Unit; index: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMemberIds, setNewMemberIds] = useState<string[]>([]);
  const [membersToDelete, setMembersToDelete] = useState<string[]>([]);
  const [currentTypes, setCurrentTypes] = useState<UnitResponsibleType[]>(unitItem.type || []);
  const [isDelegateRemoved, setIsDelegateRemoved] = useState(false);

  const { data: users } = useUsersForSelection(
    unitItem.id ? { unitId: unitItem.id } : { departmentId: '' }
  );

  const headUnit = useMemo(() => {
    return users?.data?.find((user: UserSelectionItem) => user.role === 'HEAD_OF_UNIT');
  }, [users]);

  const excludeMemberIds = useMemo(() => {
    const existingMemberIds = users?.data?.map((u) => u.id) || [];
    return [...existingMemberIds, ...newMemberIds];
  }, [users?.data, newMemberIds]);

  const handleCancel = () => {
    setCurrentTypes(unitItem.type || []);
    setIsEditing(false);
    setIsDelegateRemoved(false);
    setNewMemberIds([]);
    setMembersToDelete([]);
  };
  const handleDeleteProjectBadge = (typeToDelete: UnitResponsibleType) => {
    setCurrentTypes((prev) => prev.filter((t) => t !== typeToDelete));
  };

  const handleAddProjectBadge = (newType: UnitResponsibleType) => {
    setCurrentTypes((prev) => [...prev, newType]);
  };

  const handleAddMember = () => {
    if (!selectedUser) return;
    setNewMemberIds((prev) => [selectedUser, ...prev]);
    setSelectedUser(null);
  };

  const { mutateAsync: addMemberMutate } = useAddUnitMember();
  const { mutateAsync: delegateMutate } = useDelegateUser();
  const { mutateAsync: updateUnitMutate } = useUpdateUnit();

  const handleSave = async () => {
    try {
      const promises: Promise<any>[] = [];

      promises.push(
        updateUnitMutate({
          unitId: unitItem.id,
          updateData: { type: currentTypes, removeMemberIds: membersToDelete },
        })
      );

      if (newMemberIds.length > 0) {
        newMemberIds.forEach((userId) => {
          promises.push(addMemberMutate({ unitId: unitItem.id, userId }));
        });
      }

      // if (delegateData?.userId && delegateData.startDate) {
      //   promises.push(
      //     delegateMutate({
      //       unitId: unitItem.id,
      //       userId: delegateData.userId,
      //       startDate: delegateData.startDate,
      //       endDate: delegateData.noEndDate ? undefined : delegateData.endDate,
      //       role: 'DELEGATED_HEAD',
      //     })
      //   );
      // }

      await Promise.all(promises);
      toast.success('บันทึกข้อมูลสำเร็จ');
      setIsEditing(false);
      setNewMemberIds([]);
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      console.error(error);
    }
  };

  return (
    <>
      <Card className="p-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="h2-topic flex flex-row items-center gap-2">
              <Users /> กลุ่มงานที่ {index}
            </CardTitle>
          </div>
          {!isEditing ? (
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil />
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <Button
                variant="outline"
                className="text-normal-bold mr-3"
                onClick={() => handleCancel()}
              >
                <X />
                ยกเลิก
              </Button>
              <Button
                variant="brand"
                className="text-normal-b text-info-light"
                onClick={handleSave}
              >
                <Check /> บันทึก
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-7">
          <span className="flex items-center gap-3">
            <span className="h3-topic">ประเภทงาน</span>
            {currentTypes.map((t: UnitResponsibleType) => (
              <ProjectBadge
                type={t}
                isEditing={isEditing}
                onDeleteProjectBadge={() => handleDeleteProjectBadge(t)}
              />
            ))}
            {isEditing && (
              <ProjectTypeSelectButton
                currentTypes={currentTypes}
                onSelect={handleAddProjectBadge}
              />
            )}
          </span>

          <div className="flex items-start gap-7">
            <span className="h3-topic whitespace-nowrap">หัวหน้ากลุ่มงาน</span>

            <div className="flex flex-col gap-2">
              <span className="text-normal-normal">{headUnit?.full_name}</span>

              <DelegateUser />
            </div>
          </div>
          {isEditing && (
            <DelegateUserSelect onRemoveDelegateUser={() => setIsDelegateRemoved(true)} />
          )}

          <Collapsible>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CollapsibleTrigger className="group h3-topic flex items-center">
                  เจ้าหน้าที่ (
                  {(users?.data?.length ?? 0) + newMemberIds.length - membersToDelete.length})
                  <ChevronDown className="ml-2 h-4 w-4 group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>

                {isEditing && (
                  <div className="flex items-center gap-2">
                    <UserSelect
                      value={selectedUser}
                      onChange={setSelectedUser}
                      className="h-9 w-60"
                      placeholder="เลือกเจ้าหน้าที่..."
                      hasClearButton={false}
                      departmentId="department_procure"
                      excludeIds={excludeMemberIds}
                    />
                    <Button
                      type="button"
                      className="bg-accent text-normal-normal hover:bg-accent/80 flex h-9 w-9 items-center justify-center p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddMember();
                      }}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <CollapsibleContent className="mt-4">
              <UnitTable
                unitId={unitItem.id}
                isEditing={isEditing}
                newMemberIds={newMemberIds}
                membersToDelete={membersToDelete}
                onDeletedMembersChange={setMembersToDelete}
              />
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </>
  );
}
