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
  unitId?: string;
  departmentId?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  hasClearButton?: boolean;
}

export function UserSelect({
  value,
  onChange,
  unitId,
  departmentId,
  placeholder = 'Select user...',
  className,
  hasClearButton = true,
  disabled = false,
}: UserSelectProps) {
  const [open, setOpen] = React.useState(false);

  const { data, isLoading, isError } = useUsersForSelection(
    unitId ? { unitId } : { departmentId: departmentId || '' }
  );

  const users = data?.data || [];
  const selectedUser = users.find((user) => user.id === value);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

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
            {value && !isLoading && !disabled && hasClearButton && (
              <div
                role="button"
                onClick={handleClear}
                className="hover:bg-muted rounded-sm p-0.5 transition-colors"
                title="Clear selection"
              >
                <X className="h-4 w-4 opacity-50 hover:opacity-100" />
              </div>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50 group-data-[state=open]:rotate-180" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandList>
            <CommandEmpty>{isError ? 'Error loading users.' : 'No user found.'}</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
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
