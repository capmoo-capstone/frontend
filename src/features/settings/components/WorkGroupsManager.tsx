import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { WORK_GROUP_SETTINGS, type WorkGroupSetting } from '@/features/settings/mock-data';

import { CreateGroupPanel } from './CreateGroupPanel';
import { WorkGroupCard } from './WorkGroupCard';

export function WorkGroupsManager() {
  const [groups, setGroups] = useState<WorkGroupSetting[]>(WORK_GROUP_SETTINGS);
  const [isCreateVisible, setIsCreateVisible] = useState(false);

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-3">
          <h1 className="h1-topic text-primary">ตั้งค่ากลุ่มงาน</h1>
        </div>

        <Popover open={isCreateVisible} onOpenChange={setIsCreateVisible}>
          <PopoverTrigger asChild>
            <Button variant="secondary" type="button">
              + สร้างกลุ่มงานใหม่
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-lg" align="end">
            <CreateGroupPanel
              groups={groups}
              onCancel={() => setIsCreateVisible(false)}
              onCreate={(newGroup) => {
                setGroups((prev) => [newGroup, ...prev]);
                setIsCreateVisible(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </header>

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
    </>
  );
}
