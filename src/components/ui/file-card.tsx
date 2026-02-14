import { FileIcon } from '@untitledui/file-icons';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { Card } from './card';

interface FileCardProps {
  file: File | string;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

export function FileCard({ file, onRemove, disabled, className }: FileCardProps) {
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

  const fileName = getFileName(file);

  return (
    <Card
      className={cn(
        'border-muted-foreground/25 bg-muted/10 flex flex-row items-center justify-between rounded-md border-none p-2 transition',
        !disabled && 'hover:bg-muted/20',
        className
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {getFileIcon(fileName)}
        <span className="text-primary truncate text-sm font-medium">{fileName}</span>
      </div>

      {!disabled && onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/10 hover:text-destructive h-6 w-6 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}
