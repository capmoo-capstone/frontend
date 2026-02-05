import * as React from 'react';

import { Upload } from 'lucide-react';

import { cn } from '@/lib/utils';

import { FileCard } from './file-card';

interface FileUploadProps {
  value?: (string | File)[];
  onChange?: (files: (File | string)[]) => void;
  accept?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  maxFiles?: number;
}

export function FileUpload({
  value = [],
  onChange,
  accept,
  disabled,
  className,
  placeholder = 'คลิกเพื่ออัปโหลดเอกสาร',
  maxFiles,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && (!maxFiles || value.length < maxFiles)) {
      inputRef.current?.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...value, ...files];
      const limitedFiles = maxFiles ? newFiles.slice(0, maxFiles) : newFiles;
      onChange?.(limitedFiles);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        multiple
        className="hidden"
      />

      {/* Upload Area */}
      {(!maxFiles || value.length < maxFiles) && !(disabled && value.length > 0) && (
        <div
          onClick={handleClick}
          className={cn(
            'bg-muted/20 hover:bg-muted/40 border-muted-foreground/25 flex h-12 cursor-pointer flex-row items-center justify-center rounded-md border border-dashed p-4 transition',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <Upload className="text-muted-foreground mr-2 h-4 w-4" />
          <span className="text-muted-foreground text-sm">
            {value.length > 0 ? 'คลิกเพื่ออัปโหลดเพิ่มเติม' : placeholder}
          </span>
          {maxFiles && (
            <span className="text-muted-foreground mt-1 text-xs">
              ({value.length}/{maxFiles} ไฟล์)
            </span>
          )}
        </div>
      )}

      {/* File List */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <FileCard
              key={index}
              file={file}
              disabled={disabled}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
