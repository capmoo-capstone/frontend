import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DueDateMultiSelectProps {
  value: number | undefined;
  onChange: (v: number) => void;
  disabled?: boolean;
}

export function DueDateMultiSelect({ value, onChange, disabled }: DueDateMultiSelectProps) {
  return (
    <Select
      value={value ? String(value) : ''}
      onValueChange={(val) => onChange(Number(val))}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="เลือกจำนวนวันแจ้งเตือน..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="3">3 วัน</SelectItem>
        <SelectItem value="5">5 วัน</SelectItem>
        <SelectItem value="7">7 วัน</SelectItem>
        <SelectItem value="15">15 วัน</SelectItem>
      </SelectContent>
    </Select>
  );
}
