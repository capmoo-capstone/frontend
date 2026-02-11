'use client';

import { useState } from 'react';

import { FileText, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GenerateContractDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (contractType: string, year: string) => Promise<void>;
  projectTitle?: string;
}

export function GenerateContractDialog({
  isOpen,
  onClose,
  onConfirm,
  projectTitle: _projectTitle,
}: GenerateContractDialogProps) {
  const currentYear = new Date().getFullYear() + 543;
  const [contractType, setContractType] = useState('purchase');
  const [year, setYear] = useState(currentYear.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!contractType || !year) return;

    setIsLoading(true);
    try {
      await onConfirm(contractType, year);
      setContractType('');
      setYear(currentYear.toString());
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-106.5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            สร้างเลขที่สัญญา
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="contractType" className="text-left">
              ประเภทสัญญา <span className="text-destructive">*</span>
            </Label>
            <Select value={contractType} onValueChange={setContractType}>
              <SelectTrigger id="contractType" className="w-full">
                <SelectValue placeholder="เลือกประเภทสัญญา" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase">สำนักงานมหาวิทยาลัย</SelectItem>
                <SelectItem value="hire">คณะวิทยาศาสตร์การกีฬา</SelectItem>
                <SelectItem value="rental">คณะจิตวิทยา</SelectItem>
                <SelectItem value="service">คณะพยาบาลศาสตร์</SelectItem>
                <SelectItem value="service">คณะสหเวชศาสตร์</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="year" className="text-left">
              ปี พ.ศ. <span className="text-destructive">*</span>
            </Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="พ.ศ."
              min="2500"
              max="2600"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            ยกเลิก
          </Button>
          <Button onClick={handleConfirm} disabled={!contractType || !year || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            สร้างเลขที่สัญญา
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
