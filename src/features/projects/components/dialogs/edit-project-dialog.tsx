'use client';

import { useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type { ProjectDetail } from '../../types';

interface EditProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: EditProjectData) => Promise<void>;
  project: ProjectDetail;
}

export interface EditProjectData {
  title: string;
  description: string | null;
  budget: number | null;
  is_urgent: boolean;
}

export function EditProjectDialog({ isOpen, onClose, onConfirm, project }: EditProjectDialogProps) {
  const [formData, setFormData] = useState<EditProjectData>({
    title: project.title,
    description: project.description,
    budget: project.budget,
    is_urgent: project.is_urgent,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when project changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: project.title,
        description: project.description,
        budget: project.budget,
        is_urgent: project.is_urgent,
      });
    }
  }, [isOpen, project]);

  const handleConfirm = async () => {
    if (!formData.title.trim()) return;

    setIsLoading(true);
    try {
      await onConfirm(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูลโครงการ</DialogTitle>
          <DialogDescription>
            อัปเดตข้อมูลโครงการของคุณ กรุณากรอกข้อมูลที่ต้องการเปลี่ยนแปลง
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="required">
              ชื่อโครงการ
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="กรุณากรอกชื่อโครงการ"
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียดโครงการ</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
              placeholder="กรุณากรอกรายละเอียดโครงการ"
              rows={4}
              disabled={isLoading}
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">งบประมาณ (บาท)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  budget: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="กรุณากรอกงบประมาณ"
              disabled={isLoading}
            />
          </div>

          {/* Is Urgent */}
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_urgent"
                checked={formData.is_urgent}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, is_urgent: checked })
                }
                disabled={isLoading}
              />
              <div className="space-y-0.5">
                <Label htmlFor="is_urgent" className="cursor-pointer">
                  โครงการด่วน
                </Label>
                <p className="text-muted-foreground text-sm">
                  ทำเครื่องหมายโครงการนี้ว่าเป็นโครงการที่มีความเร่งด่วน
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            ยกเลิก
          </Button>
          <Button
            variant="brand"
            onClick={handleConfirm}
            disabled={isLoading || !formData.title.trim()}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            บันทึกการเปลี่ยนแปลง
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
