import { Checkbox } from '@/components/ui/checkbox';

interface DueDateMultiSelectProps {
  value: number[];
  onChange: (v: number[]) => void;
  disabled?: boolean;
}

export function DueDateMultiSelect({ value = [], onChange, disabled }: DueDateMultiSelectProps) {
  const options = [
    { value: 3, label: '3 วัน' },
    { value: 5, label: '5 วัน' },
    { value: 7, label: '7 วัน' },
    { value: 15, label: '15 วัน' },
  ];

  const toggleOption = (optionValue: number) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue].sort((a, b) => a - b));
    }
  };

  return (
    <div className="flex flex-1 flex-row justify-between space-y-2">
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={`due-date-${option.value}`}
            checked={value.includes(option.value)}
            onCheckedChange={() => toggleOption(option.value)}
            disabled={disabled}
          />
          <label
            htmlFor={`due-date-${option.value}`}
            className="cursor-pointer text-sm select-none"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
}
