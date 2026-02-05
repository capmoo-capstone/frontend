'use client';

import * as React from 'react';

import { Check, ChevronDown, Loader2, X } from 'lucide-react';

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

interface UserSelectProps {
  value?: string | null;
  onChange: (value: string) => void;
  onReset?: () => void;
  unitId?: string;
  departmentId?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  hasClearButton?: boolean;
  excludeIds?: string[];
}

export function UserSelect({
  value,
  onChange,
  onReset,
  unitId,
  departmentId,
  placeholder = 'Select user...',
  className,
  hasClearButton = true,
  disabled = false,
  excludeIds = [],
}: UserSelectProps) {
  const [open, setOpen] = React.useState(false);

  const { data, isLoading, isError } = useUsersForSelection(
    unitId ? { unitId } : { departmentId: departmentId || '' }
  );

  const filteredUsers = React.useMemo(() => {
    const allUsers = data?.data || [];
    if (excludeIds.length === 0) return allUsers;
    return allUsers.filter((user) => !excludeIds.includes(user.id));
  }, [data?.data, excludeIds]);

  const selectedUser = (data?.data || []).find((user) => user.id === value);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (onReset) {
      onReset();
    }
  };

  const showClear = value && !isLoading && !disabled && hasClearButton;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('group w-55 justify-between px-3', className)}
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            <span className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading...
            </span>
          ) : selectedUser ? (
            <span className="truncate">{selectedUser.full_name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}

          <div className="ml-2 flex items-center gap-1">
            {showClear ? (
              <div
                role="button"
                onClick={handleClear}
                className="hover:bg-muted rounded-sm p-0.5 transition-colors"
                title="Clear selection"
              >
                <X className="h-4 w-4 opacity-50 hover:opacity-100" />
              </div>
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandList>
            <CommandEmpty>{isError ? 'Error loading users.' : 'No user found.'}</CommandEmpty>
            <CommandGroup>
              {filteredUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.full_name}
                  onSelect={() => {
                    onChange(user.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', value === user.id ? 'opacity-100' : 'opacity-0')}
                  />
                  <div className="flex flex-col">
                    <span>{user.full_name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
