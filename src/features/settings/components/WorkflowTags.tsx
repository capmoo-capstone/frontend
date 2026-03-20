import { X } from 'lucide-react';

import { RESPONSIBLE_SELECT_OPTIONS } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface WorkflowTagsProps {
  types: string[];
  isEditing: boolean;
  onRemove?: (type: string) => void;
  onAdd?: () => void;
}

const getTypeColor = (type: string) => {
  if (type === 'LT100K') return 'border-yellow-200 bg-yellow-100 text-yellow-800';
  if (type === 'LT500K') return 'border-orange-200 bg-orange-100 text-orange-800';
  if (type === 'MT500K') return 'border-blue-200 bg-blue-100 text-blue-800';
  if (type === 'SELECTION') return 'border-emerald-200 bg-emerald-100 text-emerald-800';
  if (type === 'EBIDDING') return 'border-purple-200 bg-purple-100 text-purple-800';
  return 'border-slate-200 bg-slate-100 text-slate-800';
};

export function WorkflowTags({ types, isEditing, onRemove, onAdd }: WorkflowTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => {
        const label =
          RESPONSIBLE_SELECT_OPTIONS.find((option) => option.value === type)?.label || type;

        return (
          <span
            key={type}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm',
              getTypeColor(type)
            )}
          >
            <span className="h-2 w-2 rounded-[3px] bg-current opacity-60" />
            {label}
            {isEditing && (
              <button
                type="button"
                className="rounded-full p-0.5 hover:bg-black/10"
                onClick={() => onRemove?.(type)}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        );
      })}

      {isEditing && (
        <button
          type="button"
          className="rounded-md border border-dashed border-slate-300 px-3 py-1 text-sm text-slate-500 hover:bg-slate-50"
          onClick={onAdd}
        >
          + เพิ่มประเภทงาน
        </button>
      )}
    </div>
  );
}
