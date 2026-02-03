import { useMemo, useState } from 'react';

import { Check, ChevronDown, Pencil, UserRoundPen, UserRoundPlus, Users, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useUsersForSelection } from '@/hooks/useUsers';
import type { UnitResponsibleType } from '@/types/project';
import type { Unit } from '@/types/unit';
import type { UserSelectionItem } from '@/types/user';

import { ProjectBadge } from '../project-badge';
import { AddMemberDialog } from '../unit-dialog/add-member-dialog';
import { DelegateUserDialog } from '../unit-dialog/delegate-user-dialog';
import { UnitTable } from '../unit-table';

export function UnitCard({ unitItem, index }: { unitItem: Unit; index: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddMember, setIsAddMember] = useState(false);
  const [isDelegateUser, setIsDelegateUser] = useState(false);

  const { data: users } = useUsersForSelection(
    unitItem.id ? { unitId: unitItem.id } : { departmentId: '' }
  );

  const headUnit = useMemo(() => {
    return users?.data?.find((user: UserSelectionItem) => user.role === 'HEAD_OF_UNIT');
  }, [users]);

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
                onClick={() => setIsEditing(false)}
              >
                <X />
                ยกเลิก
              </Button>
              <Button variant="brand" className="text-normal text-info-light font-semibold">
                <Check /> บันทึก
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-7">
          <span className="flex items-center gap-4">
            <span className="h3-topic">ประเภทงาน</span>
            {unitItem.type?.map((t: UnitResponsibleType) => (
              <ProjectBadge type={t} />
            ))}
          </span>
          <span className="flex items-center gap-7">
            <span className="h3-topic">หัวหน้ากลุ่มงาน</span>
            <span className="text-normal-normal">{headUnit?.full_name}</span>
            {isEditing && (
              <Button
                className="text-normal-bold"
                variant="outline"
                onClick={() => setIsDelegateUser(true)}
              >
                <UserRoundPen /> แต่งตั้งหัวหน้างานใหม่/ผู้รักษาการแทน
              </Button>
            )}
          </span>
          <Collapsible>
            <CollapsibleTrigger className="group h3-topic">
              เจ้าหน้าที่ ({users?.data?.length ?? 0})
              <Button className="ml-4 inline-block px-1" variant="ghost">
                <ChevronDown className="group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            {isEditing && (
              <Button
                className="text-normal-bold ml-4"
                variant="outline"
                onClick={() => setIsAddMember(true)}
              >
                <UserRoundPlus /> เพิ่มเจ้าหน้าที่
              </Button>
            )}
            <CollapsibleContent>
              <UnitTable unitId={unitItem.id} isEditing={isEditing} />
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      <AddMemberDialog
        isOpen={isAddMember}
        onClose={() => setIsAddMember(false)}
        index={index}
        unitId={unitItem.id}
      />

      <DelegateUserDialog
        isOpen={isDelegateUser}
        onClose={() => setIsDelegateUser(false)}
        unitId={unitItem.id}
        role="HEAD_OF_UNIT"
      />
    </>
  );
}
