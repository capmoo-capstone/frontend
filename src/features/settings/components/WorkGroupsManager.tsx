import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { WORK_GROUP_SETTINGS, type WorkGroupSetting } from '@/features/settings/mock-data';
import { cn } from '@/lib/utils';

import { CreateGroupPanel } from './CreateGroupPanel';
import { WorkGroupCard } from './WorkGroupCard';

export function WorkGroupsManager() {
  const [groups, setGroups] = useState<WorkGroupSetting[]>(WORK_GROUP_SETTINGS);
  const [isCreateVisible, setIsCreateVisible] = useState(false);

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900">ตั้งค่ากลุ่มงาน</h1>
        </div>

        <Button type="button" onClick={() => setIsCreateVisible((prev) => !prev)}>
          + สร้างกลุ่มงานใหม่
        </Button>
      </header>

      <div
        className={cn('grid gap-4', isCreateVisible ? 'lg:grid-cols-[1.8fr_1fr]' : 'grid-cols-1')}
      >
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

        {isCreateVisible && (
          <CreateGroupPanel
            groups={groups}
            onCancel={() => setIsCreateVisible(false)}
            onCreate={(newGroup) => {
              setGroups((prev) => [newGroup, ...prev]);
              setIsCreateVisible(false);
            }}
          />
        )}
      </div>
    </>
  );
}
