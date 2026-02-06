import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getResponsibleTypeFormat } from '@/lib/responsible-type-format';
import type { UnitResponsibleType } from '@/types/project';

export function ProjectBadge({
  type,
  isEditing,
  onDeleteProjectBadge,
}: {
  type: UnitResponsibleType;
  isEditing?: boolean;
  onDeleteProjectBadge: () => void;
}) {
  const config = getResponsibleTypeFormat(type);

  return (
    <Badge
      className="flex h-9 items-center gap-2 rounded-lg px-3 before:hidden"
      style={{ backgroundColor: config.bg }}
    >
      <div className="h-3 w-3 shrink-0 rounded-xs" style={{ backgroundColor: config.indicator }} />

      <span className="text-primary leading-none">{config.label}</span>

      {isEditing && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteProjectBadge();
          }}
          className="bg-background/80 text-destructive hover:bg-destructive/10 ml-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full p-0 transition-colors"
        >
          <X strokeWidth={3} className="h-4 w-4" />
        </Button>
      )}
    </Badge>
  );
}
