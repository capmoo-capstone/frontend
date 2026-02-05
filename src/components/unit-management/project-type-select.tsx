import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { getResponsibleTypeFormat } from '@/lib/responsible-type-format';
import type { UnitResponsibleType } from '@/types/project';
import { UnitResponsibleTypeEnum } from '@/types/project';

import { Button } from '../ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export function ProjectTypeSelectButton({
  currentTypes,
  onSelect,
}: {
  currentTypes: UnitResponsibleType[];
  onSelect: (type: UnitResponsibleType) => void;
}) {
  const [open, setOpen] = useState(false);

  const allTypes = UnitResponsibleTypeEnum.options;
  const availableTypes = allTypes.filter((type) => !currentTypes.includes(type));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="dash" className="text-primary h-9 gap-2 px-3 py-2 text-sm">
          เพิ่มประเภทโครงการ <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {availableTypes.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center text-sm">
                  เลือกครบทุกประเภทแล้ว
                </div>
              ) : (
                availableTypes.map((type) => {
                  const config = getResponsibleTypeFormat(type);
                  return (
                    <CommandItem
                      key={type}
                      value={type}
                      onSelect={() => {
                        onSelect(type);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="h-3 w-3 shrink-0 rounded-xs"
                        style={{ backgroundColor: config.indicator }}
                      />
                      {config.label}
                    </CommandItem>
                  );
                })
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
