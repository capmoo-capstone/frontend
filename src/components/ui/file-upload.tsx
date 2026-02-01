import * as React from 'react';

import { FileIcon } from '@untitledui/file-icons';
import { Upload, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { Card } from './card';

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

  const getFileName = (file: File | string): string => {
    if (file instanceof File) {
      return file.name;
    }
    const parts = file.split('/');
    return parts[parts.length - 1];
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase() || '';

    return <FileIcon type={ext} size={20} className="text-muted-foreground" />;
  };

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

  const handleRemove = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
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
          {value.map((file, index) => {
            const name = getFileName(file);
            return (
              <Card
                key={`${name}-${index}`}
                className={cn(
                  'border-muted-foreground/25 bg-muted/10 flex flex-row items-center justify-between rounded-md border-none p-2 transition',
                  !disabled && 'hover:bg-muted/20'
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {getFileIcon(name)}
                  <span className="text-foreground truncate text-sm font-medium">{name}</span>
                </div>

                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hover:bg-destructive/10 hover:text-destructive h-6 w-6 shrink-0"
                    onClick={handleRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
