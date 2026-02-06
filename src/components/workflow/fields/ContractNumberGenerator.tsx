import { useState } from 'react';

import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ContractNumberGeneratorProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function ContractNumberGenerator({
  value,
  onChange,
  disabled,
}: ContractNumberGeneratorProps) {
  const [type, setType] = useState('CN');
  const [year, setYear] = useState(new Date().getFullYear() + 543 + '');
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = () => {
    // Mock Generation Logic
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generated = `${type}${randomNum}/${year}`;
    onChange(generated);
    setIsOpen(false);
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        readOnly
        placeholder="กดปุ่มเพื่อสร้างเลขที่..."
        disabled={disabled}
        className="bg-muted/50"
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className="text-primary hover:bg-primary/5 shrink-0 gap-2 border-dashed"
          >
            <Sparkles className="h-4 w-4" />
            สร้างเลข
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <h4 className="leading-none font-medium">สร้างเลขที่สัญญา</h4>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="type">ประเภท</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type" className="col-span-2 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CN">CN (สัญญาจ้าง)</SelectItem>
                    <SelectItem value="PO">PO (ใบสั่งซื้อ)</SelectItem>
                    <SelectItem value="MO">MO (บันทึกข้อตกลง)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="year">ปีงบประมาณ</Label>
                <Input
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="col-span-2 h-8"
                />
              </div>
            </div>
            <Button onClick={handleGenerate} className="w-full" variant="brand">
              ยืนยันการสร้าง
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
