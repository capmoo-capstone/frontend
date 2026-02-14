'use client';

import { useState } from 'react';

import { Search } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SearchCheckboxProps {
  items: { id: string; name?: string; full_name?: string }[];
  placeholder?: string;
  value?: string[];
  onChange?: (values: string[]) => void;
}
export function SearchCheckbox({
  items = [],
  placeholder,
  value = [],
  onChange,
}: SearchCheckboxProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const selectedLabels = items
    .filter((item) => value.includes(item.id))
    .map((item) => item.name || item.full_name)
    .join(', ');

  const filteredItems = items.filter((item) =>
    (item.name || item.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="normal relative">
            <Input
              placeholder={placeholder || 'ค้นหา'}
              value={open ? searchTerm : selectedLabels}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!open) setOpen(true);
              }}
              readOnly={!open}
              className="normal"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent">
              <Search className="text-muted-foreground h-4 w-4" />
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="bg-background mt-2 w-(--radix-popover-trigger-width) rounded-lg border p-2 shadow-xs"
          align="start"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <div className="max-h-50 overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-50"
                onClick={() => {
                  const nextValues = value.includes(item.id)
                    ? value.filter((v) => v !== item.id)
                    : [...value, item.id];
                  onChange?.(nextValues);
                }}
              >
                <Checkbox checked={value.includes(item.id)} />
                <span className="normal">{item.name || item.full_name}</span>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="text-destructive py-8 text-center text-sm">ไม่พบข้อมูล</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
