import { useMemo, useState } from 'react';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RESPONSIBLE_SELECT_OPTIONS, getResponsibleTypeFormat } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface WorkflowTagsProps {
  types: string[];
  isEditing: boolean;
  onRemove?: (type: string) => void;
  onAddMany?: (types: string[]) => void;
  availableOptions?: Array<{ value: string; label: string }>;
}

const getTypePresentation = (type: string) => {
  const option = RESPONSIBLE_SELECT_OPTIONS.find((item) => item.value === type);

  if (!option) {
    return {
      label: type,
      backgroundColor: undefined,
      indicatorColor: undefined,
    };
  }

  const formatted = getResponsibleTypeFormat(option.value);
  return {
    label: formatted.label,
    backgroundColor: formatted.bg,
    indicatorColor: formatted.indicator,
  };
};

export function WorkflowTags({
  types,
  isEditing,
  onRemove,
  onAddMany,
  availableOptions,
}: WorkflowTagsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingTypes, setPendingTypes] = useState<string[]>([]);

  const selectableOptions = useMemo(() => {
    if (availableOptions) return availableOptions;

    return RESPONSIBLE_SELECT_OPTIONS.filter((option) => !types.includes(option.value));
  }, [availableOptions, types]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setPendingTypes([]);
    }
  };

  const togglePendingType = (type: string, checked: boolean | 'indeterminate') => {
    if (checked) {
      setPendingTypes((prev) => (prev.includes(type) ? prev : [...prev, type]));
      return;
    }

    setPendingTypes((prev) => prev.filter((item) => item !== type));
  };

  const handleAddSelected = () => {
    if (pendingTypes.length === 0) return;

    onAddMany?.(pendingTypes);
    setPendingTypes([]);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => {
        const presentation = getTypePresentation(type);

        return (
          <span
            key={type}
            className={cn(
              'normal text-primary inline-flex items-center gap-1.5 rounded-md px-3 py-1',
              !presentation.backgroundColor && 'bg-slate-100 text-slate-800'
            )}
            style={{ backgroundColor: presentation.backgroundColor }}
          >
            <span
              className={cn('h-3 w-3 rounded', !presentation.indicatorColor && 'bg-current')}
              style={{ backgroundColor: presentation.indicatorColor }}
            />
            {presentation.label}
            {isEditing && (
              <button
                type="button"
                className="rounded-full p-0.5 hover:bg-black/10"
                onClick={() => onRemove?.(type)}
              >
                <X className="text-error h-4 w-4" />
              </button>
            )}
          </span>
        );
      })}

      {isEditing && (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="border-dashed text-slate-500"
              disabled={selectableOptions.length === 0}
            >
              {selectableOptions.length === 0 ? 'ไม่มีประเภทงานให้เพิ่ม' : '+ เพิ่มประเภทงาน'}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[320px] p-3">
            <div className="space-y-3">
              <p className="normal-b text-primary">เลือกประเภทงานที่ต้องการเพิ่ม</p>

              {selectableOptions.length === 0 ? (
                <p className="caption text-muted-foreground">ไม่มีประเภทงานที่สามารถเพิ่มได้</p>
              ) : (
                <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                  {selectableOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-start gap-2 rounded-md px-1 py-1 hover:bg-slate-50"
                    >
                      <Checkbox
                        checked={pendingTypes.includes(option.value)}
                        onCheckedChange={(checked) => togglePendingType(option.value, checked)}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-slate-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                  ยกเลิก
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="brand"
                  onClick={handleAddSelected}
                  disabled={pendingTypes.length === 0}
                >
                  เพิ่ม
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
