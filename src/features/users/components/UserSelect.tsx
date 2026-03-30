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
import { cn } from '@/lib/utils';

import { useUsersForSelection } from '../hooks/useUsers';

interface UserSelectProps {
  value?: string | null;
  onChange: (value: string) => void;
  onSelectUser?: (user: { id: string; full_name: string }) => void;
  options?: Array<{ id: string; full_name: string; role?: string }>;
  onBlur?: () => void;
  onReset?: () => void;
  unitId?: string;
  deptId?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  hasClearButton?: boolean;
}

export function UserSelect({
  value,
  onChange,
  onSelectUser,
  options,
  onBlur,
  onReset,
  unitId,
  deptId,
  placeholder = 'Select user...',
  className,
  hasClearButton = true,
  disabled = false,
}: UserSelectProps) {
  const [open, setOpen] = React.useState(false);
  const shouldFetchUsers = !options;

  const { data, isLoading, isError } = useUsersForSelection(
    unitId ? { unitId } : { deptId: deptId || '' },
    { enabled: shouldFetchUsers }
  );

  const users = options ?? data?.data ?? [];
  const selectedUser = users.find((user) => user.id === value);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (onBlur) {
      onBlur();
    }
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
          className={cn('group w-full min-w-0 justify-between px-3 sm:w-55', className)}
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
      <PopoverContent
        className="w-(--radix-popover-trigger-width) max-w-[calc(100vw-2rem)] p-0 sm:max-w-none"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandList>
            <CommandEmpty>{isError ? 'Error loading users.' : 'No user found.'}</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.full_name} ${user.role ?? ''}`}
                  onSelect={() => {
                    onChange(user.id);
                    onSelectUser?.({ id: user.id, full_name: user.full_name });
                    setOpen(false);
                    if (onBlur) {
                      onBlur();
                    }
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
