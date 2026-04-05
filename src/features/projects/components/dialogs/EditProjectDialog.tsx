'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

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

import type { ProjectDetail, ProjectUrgentStatus } from '../../types/index';
import { ProjectUrgentStatusEnum } from '../../types/index';

const isUrgentProject = (value: ProjectUrgentStatus) =>
  value === 'URGENT' || value === 'VERY_URGENT' || value === 'SUPER_URGENT';

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
  is_urgent: ProjectUrgentStatus;
}

const EditProjectSchema = z.object({
  title: z.string().trim().min(1, 'กรุณากรอกชื่อโครงการ'),
  description: z.string().nullable(),
  budget: z.number().nullable(),
  is_urgent: ProjectUrgentStatusEnum,
});

type EditProjectFormValues = z.infer<typeof EditProjectSchema>;

export function EditProjectDialog({ isOpen, onClose, onConfirm, project }: EditProjectDialogProps) {
  const form = useForm<EditProjectFormValues>({
    resolver: zodResolver(EditProjectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      budget: project.budget,
      is_urgent: project.is_urgent,
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  // Reset form when project changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: project.title,
        description: project.description,
        budget: project.budget,
        is_urgent: project.is_urgent,
      });
    }
  }, [isOpen, project, form]);

  const handleClose = () => {
    if (!isSubmitting) {
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

        <form
          onSubmit={form.handleSubmit(async (values) => onConfirm(values))}
          className="space-y-4 py-4"
        >
          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="required">
              ชื่อโครงการ
            </Label>
            <Controller
              control={form.control}
              name="title"
              render={({ field }) => (
                <Input
                  id="title"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="กรุณากรอกชื่อโครงการ"
                  disabled={isSubmitting}
                />
              )}
            />
            {form.formState.errors.title && (
              <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียดโครงการ</Label>
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Textarea
                  id="description"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  placeholder="กรุณากรอกรายละเอียดโครงการ"
                  rows={4}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">งบประมาณ (บาท)</Label>
            <Controller
              control={form.control}
              name="budget"
              render={({ field }) => (
                <Input
                  id="budget"
                  type="number"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  placeholder="กรุณากรอกงบประมาณ"
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          {/* Is Urgent */}
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Controller
                control={form.control}
                name="is_urgent"
                render={({ field }) => (
                  <Checkbox
                    id="is_urgent"
                    checked={isUrgentProject(field.value)}
                    onCheckedChange={(checked) =>
                      field.onChange(Boolean(checked) ? 'URGENT' : 'NORMAL')
                    }
                    disabled={isSubmitting}
                  />
                )}
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

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting} type="button">
              ยกเลิก
            </Button>
            <Button variant="brand" type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              บันทึกการเปลี่ยนแปลง
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
