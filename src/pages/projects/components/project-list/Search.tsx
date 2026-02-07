import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  placeholder?: string;
}
export function SearchInput({ placeholder }: SearchInputProps) {
  return (
    <div className="bg-background relative rounded-lg">
      <Input className="normal pr-10" placeholder={placeholder || 'ค้นหา'} />
      <Button
        variant="ghost"
        className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent"
      >
        <Search className="text-muted-foreground h-4 w-4" />
      </Button>
    </div>
  );
}
