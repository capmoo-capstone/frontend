import { useState } from 'react';

import { Plus, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MultiEmailInputProps {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiEmailInput({
  value = [],
  onChange,
  placeholder,
  disabled,
}: MultiEmailInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addEmail = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(value.filter((email) => email !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        <Button
          type="button"
          onClick={addEmail}
          disabled={!inputValue.trim() || disabled}
          variant="secondary"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((email, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="flex items-center gap-1 py-1 pr-1 pl-2 font-normal"
            >
              {email}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="rounded-full p-0.5 transition-colors hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
