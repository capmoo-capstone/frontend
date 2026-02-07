'use client';

import { useState } from 'react';

import { Search } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SearchCheckboxProps {
  items: { value: string; label: string }[];
  placeholder?: string;
}
export function SearchCheckbox({ items, placeholder }: SearchCheckboxProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="normal relative">
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!open) setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              className="normal"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent">
              <Search className="text-muted-foreground h-4 w-4" />
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="bg-background mt-2 w-[var(--radix-popover-trigger-width)] rounded-lg border-1 p-2 shadow-xs"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div>
            {filteredItems.map((item) => (
              <div
                key={item.value}
                className="flex items-center gap-2 rounded-xl px-2 py-2"
                onClick={() => {
                  setSelectedValues((prev) =>
                    prev.includes(item.value)
                      ? prev.filter((v) => v !== item.value)
                      : [...prev, item.value]
                  );
                }}
              >
                <Checkbox checked={selectedValues.includes(item.value)} />
                <span className="normal">{item.label}</span>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="py-8 text-center text-sm">ไม่พบข้อมูล</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
