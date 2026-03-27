import * as React from 'react';

import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUsersForSelection } from '@/hooks/useUsers';
import { cn } from '@/lib/utils';

interface UserSearchComboboxProps {
  value?: string;
  onChange: (value: string, label: string) => void;
  options?: Array<{ id: string; full_name: string; role?: string }>;
  departmentId?: string;
  unitId?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function UserSearchCombobox({
  value,
  onChange,
  options,
  departmentId,
  unitId,
  placeholder = 'กรุณาเลือกเจ้าหน้าที่...',
  disabled = false,
  className,
}: UserSearchComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const query = unitId ? { unitId } : { deptId: departmentId || '' };
  const { data, isLoading, isError } = useUsersForSelection(query);

  const users = options ?? data?.data ?? [];
  const selected = users.find((user) => user.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className={cn('w-full justify-between', className)}
        >
          {isLoading ? (
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> กำลังโหลดรายชื่อ...
            </span>
          ) : selected ? (
            <span className="truncate">{selected.full_name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="text-muted-foreground h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder="ค้นหาเจ้าหน้าที่..." />
          <CommandList>
            <CommandEmpty>
              {isError ? 'โหลดข้อมูลไม่สำเร็จ' : 'ไม่พบข้อมูลเจ้าหน้าที่'}
            </CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.full_name} ${user.role ?? ''}`}
                  onSelect={() => {
                    onChange(user.id, user.full_name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', value === user.id ? 'opacity-100' : 'opacity-0')}
                  />
                  <span className="truncate">{user.full_name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
