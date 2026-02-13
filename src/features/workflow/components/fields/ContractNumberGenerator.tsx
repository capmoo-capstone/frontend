import { useState } from 'react';

import { Sparkles, X } from 'lucide-react';

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
  const [type, setType] = useState('CU');
  const [year, setYear] = useState(new Date().getFullYear() + 543 + '');
  const [isOpen, setIsOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const hasGeneratedNumber = !!value;

  const handleGenerate = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generated = `${type}${randomNum}/${year}`;
    onChange(generated);
    setIsOpen(false);
  };

  const handleConfirmCancel = () => {
    if (cancelReason.trim()) {
      onChange('');
      setCancelReason('');
      setShowCancelDialog(false);
    }
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
      {!hasGeneratedNumber ? (
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
                    <SelectTrigger id="type" className="col-span-2 h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CU">สำนักงานมหาวิทยาลัย</SelectItem>
                      <SelectItem value="SP">คณะวิทยาศาสตร์การกีฬา</SelectItem>
                      <SelectItem value="PSY">คณะจิตวิทยา</SelectItem>
                      <SelectItem value="NUR">คณะพยาบาลศาสตร์</SelectItem>
                      <SelectItem value="HS">คณะสหเวชศาสตร์</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="year">ปีงบประมาณ</Label>
                  <Input
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="col-span-2 h-9"
                  />
                </div>
              </div>
              <Button onClick={handleGenerate} className="w-full" variant="brand">
                ยืนยันการสร้าง
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Popover open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className="text-destructive hover:bg-destructive/5 shrink-0 gap-2 border-dashed"
              onClick={() => setShowCancelDialog(true)}
            >
              <X className="h-4 w-4" />
              ยกเลิก
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <h4 className="leading-none font-medium">ยกเลิกเลขที่สัญญา</h4>
              <p className="text-muted-foreground text-sm">
                คุณกำลังยกเลิกเลขที่: <span className="text-foreground font-medium">{value}</span>
              </p>
              <div className="space-y-2">
                <Label htmlFor="cancel-reason">เหตุผลในการยกเลิก *</Label>
                <Input
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="ระบุเหตุผล..."
                  className="h-9"
                />
              </div>
              <Button
                onClick={handleConfirmCancel}
                className="w-full"
                variant="destructive"
                disabled={!cancelReason.trim()}
              >
                ยืนยันการยกเลิก
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
