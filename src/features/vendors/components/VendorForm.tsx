import { useState } from 'react';

import { Check, CloudUpload, FileText, Loader2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { VendorFormData } from '../types';

interface VendorFormProps {
  onSubmit?: (data: VendorFormData) => Promise<void>;
}

export function VendorForm({ onSubmit }: VendorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState<VendorFormData>({
    po: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({ ...formData, files });
      } else {
        // Default mock behavior
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('Submitting:', { ...formData, files });
      }
      setIsSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({ po: '' });
    setFiles([]);
  };

  return (
    <div className="bg-background flex w-full flex-row">
      <div className="bg-muted fixed top-0 bottom-0 left-0 hidden w-1/2 lg:block">
        <img
          src="/loginBg.png"
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Spacer for the fixed left column */}
      <div className="hidden w-1/2 lg:block" />

      {/* Right Side: Upload Form (Scrollable) */}
      <div className="flex w-full flex-col px-8 lg:w-1/2 lg:px-24">
        {isSuccess ? (
          /* Success State */
          <div className="mx-auto flex w-full max-w-125 flex-col items-center gap-8 py-12">
            <div className="flex flex-col items-center gap-4">
              <img src="/chula.svg" alt="Logo" className="h-12 w-auto object-contain" />
              <h1 className="text-brand-9 text-3xl font-bold tracking-tight">NexusProcure</h1>
              <p className="text-muted-foreground text-sm">Vendor Bill Submission</p>
            </div>

            <div className="flex flex-col items-center gap-6 py-8">
              <div className="bg-success/10 flex h-24 w-24 items-center justify-center rounded-full">
                <Check className="text-success h-12 w-12 stroke-3" />
              </div>
              <h2 className="h2-topic text-center">ได้รับข้อมูลเรียบร้อย</h2>
            </div>

            <Button variant="outline" size="lg" onClick={handleReset}>
              ส่งเอกสารอีกครั้ง
            </Button>
          </div>
        ) : (
          /* Form State */
          <div className="mx-auto flex w-full max-w-125 flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2 border-b pb-6">
              <div className="flex items-center gap-4">
                <img src="/chula.svg" alt="Logo" className="h-12 w-auto object-contain" />
                <h1 className="text-brand-9 text-3xl font-bold tracking-tight">NexusProcure</h1>
              </div>
              <div>
                <h2 className="text-foreground mt-4 text-xl font-semibold">
                  ส่งเอกสารส่งมอบ/ใบแจ้งหนี้สำหรับผู้ขาย
                </h2>
                <p className="text-muted-foreground text-sm">
                  กรุณากรอกข้อมูลและอัปโหลดเอกสารที่เกี่ยวข้อง
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col items-center gap-5">
              {/* Company Info */}
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label className="normal text-foreground">
                    เลขที่ใบสั่งซื้อ (PO) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.po}
                    onChange={(e) => setFormData({ ...formData, po: e.target.value })}
                    placeholder="เลข 13 หลัก"
                    className="h-11 bg-white"
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div className="w-full space-y-3 pt-2">
                <Label className="normal text-foreground">
                  อัปโหลดไฟล์ส่งมอบ/ใบแจ้งหนี้ <span className="text-red-500">*</span>
                </Label>

                <div className="border-input bg-muted/20 hover:bg-muted/40 relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors">
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.png"
                  />
                  <div className="bg-primary/10 mb-3 rounded-full p-3">
                    <CloudUpload className="text-primary h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">คลิกเพื่ออัปโหลด</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    รองรับไฟล์ PDF, JPG, PNG (ไม่เกิน 5MB)
                  </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="animate-in fade-in slide-in-from-bottom-2 flex items-center justify-between rounded-md border bg-white p-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="rounded bg-blue-50 p-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
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
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button variant="brand" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      กำลังบันทึกข้อมูล...
                    </>
                  ) : (
                    'ส่งเอกสาร'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
