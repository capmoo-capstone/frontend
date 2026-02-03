import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { UnitCard } from '@/components/unit-management/unit-card/unit-card';
import { useUnits } from '@/hooks/useUnits';
import type { Unit } from '@/types/unit';

export default function GroupManagement() {
  const { data: units } = useUnits();
  return (
    <div>
      <div className="flex flex-col gap-4">
        {units?.map((unitItem: Unit, index: number) => (
          <UnitCard key={unitItem.id} unitItem={unitItem} index={index + 1} />
        ))}
      </div>
      <Button
        className="h2-topic text-muted-foreground border-muted-foreground mt-6 w-full p-6 font-semibold"
        variant="dash"
      >
        <Plus />
        สร้างกลุ่มงานใหม่
      </Button>
    </div>
  );
}
