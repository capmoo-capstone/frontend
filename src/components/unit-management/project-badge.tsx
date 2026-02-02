import { getResponsibleTypeFormat } from '@/lib/responsible-type-format';
import type { UnitResponsibleType } from '@/types/project';

import { Badge } from '../ui/badge';

export function ProjectBadge({ type }: { type: UnitResponsibleType }) {
  const config = getResponsibleTypeFormat(type);

  return (
    <Badge
      className="text-normal-normal gap-2 rounded-lg px-3 py-2 before:hidden"
      style={{ backgroundColor: config.bg }}
    >
      <div className="h-3 w-3 shrink-0 rounded-xs" style={{ backgroundColor: config.indicator }} />
      {config.label}
    </Badge>
  );
}
