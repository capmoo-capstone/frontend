'use client';

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

interface UserSelectProps {
  value?: string | null;
  onChange: (value: string) => void;
  unitId?: string;
  departmentId?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function UserSelect({
  value,
  onChange,
  unitId,
  departmentId,
  placeholder = 'Select user...',
  className,
  disabled = false,
}: UserSelectProps) {
  const [open, setOpen] = React.useState(false);

  const { data, isLoading, isError } = useUsersForSelection(
    unitId ? { unitId } : { departmentId: departmentId || '' }
  );

  const users = data?.data || [];

  const selectedUser = users.find((user) => user.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-55 justify-between', className)}
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading...
            </span>
          ) : selectedUser ? (
            selectedUser.full_name
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                    className={cn('mr-1 h-4 w-4', value === user.id ? 'opacity-100' : 'opacity-0')}
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
