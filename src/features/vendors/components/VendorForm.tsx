import { useState } from 'react';

import axios from 'axios';
import { Check, FileText, Loader2, Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { useCreateVendorSubmission } from '../hooks/useVendorSubmissions';
import type { CreateVendorSubmissionPayload, VendorFormData } from '../types';

interface VendorFormProps {
  onSubmit?: (data: VendorFormData) => Promise<void>;
}

const VENDOR_BILLING_FIELD_KEY = 'contract_billing_doc';

const getSubmissionErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
};

export function VendorForm({ onSubmit }: VendorFormProps) {
  const createVendorSubmission = useCreateVendorSubmission();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<{
    po?: string;
    installment?: string;
    files?: string;
    submit?: string;
  }>({});

  const [formData, setFormData] = useState<VendorFormData>({
    po: '',
    installment: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const maxSize = 5 * 1024 * 1024; // 5MB

      const oversizedFiles = newFiles.filter((file) => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        setErrors((prev) => ({
          ...prev,
          files: `ไฟล์ ${oversizedFiles.map((f) => f.name).join(', ')} มีขนาดเกิน 5MB`,
        }));
        return;
      }

      setFiles((prev) => [...prev, ...newFiles]);
      setErrors((prev) => ({ ...prev, files: undefined }));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: { po?: string; installment?: string; files?: string } = {};
    const installmentValue = formData.installment?.trim();

    if (!formData.po.trim()) {
      newErrors.po = 'กรุณาระบุเลขที่ใบสั่งซื้อ';
    }

    if (installmentValue) {
      const installmentNumber = Number(installmentValue);
      if (!Number.isInteger(installmentNumber) || installmentNumber <= 0) {
        newErrors.installment = 'งวดที่ต้องเป็นตัวเลขจำนวนเต็มมากกว่า 0';
      }
    }

    // Validate files
    if (files.length === 0) {
      newErrors.files = 'กรุณาอัปโหลดไฟล์';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildSubmissionPayload = (): CreateVendorSubmissionPayload => {
    const installmentValue = formData.installment?.trim();

    return {
      type: 'VENDOR',
      workflow_type: 'CONTRACT',
      step_order: 2,
      po_no: formData.po.trim(),
      ...(installmentValue ? { installment: Number(installmentValue) } : {}),
      files: files.map((file) => ({
        field_key: VENDOR_BILLING_FIELD_KEY,
        file_name: file.name,
        file_path: file.name,
      })),
    };
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: undefined }));
    try {
      if (onSubmit) {
        await onSubmit({ ...formData, files });
      } else {
        await createVendorSubmission.mutateAsync(buildSubmissionPayload());
      }
      setIsSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors((prev) => ({ ...prev, submit: getSubmissionErrorMessage(error) }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({ po: '', installment: '' });
    setFiles([]);
    setErrors({});
  };

  return (
    <div>
      {isSuccess ? (
        /* Success State */
        <div className="mx-auto flex w-full max-w-125 flex-col items-center gap-8 py-12">
          <div className="flex flex-col items-center gap-6 py-8">
            <Check className="text-success h-17 w-17 stroke-2" />

            <h4 className="normal text-center">ได้รับข้อมูลเรียบร้อย</h4>
          </div>

          <Button variant="outline" size="lg" onClick={handleReset}>
            ส่งไฟล์เพิ่มเติม
          </Button>
        </div>
      ) : (
        /* Form State */
        <div className="flex w-full flex-col items-center">
          {/* Company Info */}
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Label className="normal-b text-foreground">
                เลขที่ใบสั่งซื้อ (PO) <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.po}
                onChange={(e) => {
                  setFormData({ ...formData, po: e.target.value });
                  setErrors((prev) => ({ ...prev, po: undefined }));
                }}
                placeholder="กรุณากรอกเลขที่ใบสั่งซื้อ"
                className={errors.po ? 'h-11 border-red-500 bg-white' : 'h-11 bg-white'}
              />
              {errors.po && <p className="text-sm text-red-500">{errors.po}</p>}
            </div>

            <div className="space-y-2">
              <Label className="normal-b text-foreground">งวดที่</Label>
              <Input
                type="number"
                min={1}
                step={1}
                value={formData.installment ?? ''}
                onChange={(e) => {
                  setFormData({ ...formData, installment: e.target.value });
                  setErrors((prev) => ({ ...prev, installment: undefined, submit: undefined }));
                }}
                placeholder="กรุณากรอกงวดที่ (ถ้ามี)"
                className={errors.installment ? 'h-11 border-red-500 bg-white' : 'h-11 bg-white'}
              />
              {errors.installment && <p className="text-sm text-red-500">{errors.installment}</p>}
            </div>
          </div>

          {/* File Upload Section */}
          <div className="w-full space-y-3 pt-10">
            <Label className="normal-b text-foreground">
              อัปโหลดไฟล์ใบแจ้งหนี้/ใบส่งของ/ใบวางบิล <span className="text-red-500">*</span>
            </Label>

            {files.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="animate-in fade-in slide-in-from-bottom-2 flex items-center justify-between rounded-md border bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="text-primary h-6 w-6" />

                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">{file.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-muted-foreground hover:text-destructive p-2 transition-colors"
                      aria-label={`ลบไฟล์ ${file.name}`}
                    >
                      <X className="text-destructive h-6 w-6" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className={cn(
                'border-input bg-muted/20 hover:bg-muted/40 relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-6 text-center transition-colors',
                errors.files && 'border-red-500'
              )}
            >
              <input
                type="file"
                multiple
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.png"
                aria-label="อัปโหลดไฟล์ส่งมอบ/ใบแจ้งหนี้"
              />

              <Upload className="text-muted-foreground mb-3 h-7 w-7" />

              <p className="text-muted-foreground text-sm">กรุณาอัปโหลดไฟล์</p>
              <p className="text-muted-foreground mt-1 text-xs">
                รองรับไฟล์ PDF, JPG, PNG (ไม่เกิน 5MB)
              </p>
            </div>
            {errors.files && <p className="text-sm text-red-500">{errors.files}</p>}
          </div>

          {errors.submit && (
            <p className="pt-4 text-center text-sm text-red-500">{errors.submit}</p>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <Button variant="brand" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  กำลังบันทึกข้อมูล...
                </>
              ) : (
                'ส่งไฟล์'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
