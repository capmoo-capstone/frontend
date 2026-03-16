'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

import { AlertTriangle, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type DialogVariant = 'default' | 'destructive' | 'brand';

interface BaseSharedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: DialogVariant;
  icon?: LucideIcon;
  iconClassName?: string;
  disableConfirm?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

interface SimpleDialogProps extends BaseSharedDialogProps {
  type: 'simple';
  onConfirm: () => Promise<void> | void;
}

interface TextareaDialogProps extends BaseSharedDialogProps {
  type: 'textarea';
  onConfirm: (value: string) => Promise<void> | void;
  textareaLabel?: string;
  textareaPlaceholder?: string;
  textareaRequired?: boolean;
  textareaRows?: number;
}

interface CustomDialogProps extends BaseSharedDialogProps {
  type: 'custom';
  onConfirm: () => Promise<void> | void;
  children: ReactNode;
}

type SharedDialogProps = SimpleDialogProps | TextareaDialogProps | CustomDialogProps;

const MAX_WIDTH_CLASSES = {
  sm: 'sm:max-w-106.25',
  md: 'sm:max-w-125',
  lg: 'sm:max-w-150',
};

export function SharedDialog(props: SharedDialogProps) {
  const {
    isOpen,
    onClose,
    title,
    description,
    confirmLabel = 'ตกลง',
    cancelLabel = 'ยกเลิก',
    variant = 'default',
    icon: Icon,
    iconClassName,
    disableConfirm = false,
    maxWidth = 'sm',
    centered = false,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [textareaValue, setTextareaValue] = useState('');

  const handleConfirm = async () => {
    // Validate textarea if required
    if (props.type === 'textarea' && props.textareaRequired && !textareaValue.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      if (props.type === 'textarea') {
        await props.onConfirm(textareaValue);
      } else {
        await props.onConfirm();
      }
      setTextareaValue('');
      onClose();
    } catch (error) {
      console.error('Dialog confirmation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTextareaValue('');
      onClose();
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'brand':
        return 'brand';
      default:
        return 'default';
    }
  };

  const getIconColorClass = () => {
    switch (variant) {
      case 'destructive':
        return 'text-destructive';
      case 'brand':
        return 'text-brand';
      default:
        return 'text-primary';
    }
  };

  const isConfirmDisabled =
    isLoading ||
    disableConfirm ||
    (props.type === 'textarea' && props.textareaRequired && !textareaValue.trim());

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn(MAX_WIDTH_CLASSES[maxWidth])}>
        <DialogHeader className={cn(centered && 'flex flex-col items-center text-center')}>
          <DialogTitle
            className={cn(
              'flex items-center gap-2',
              centered && 'h3-topic justify-center',
              variant === 'destructive' && 'text-destructive'
            )}
          >
            {Icon && <Icon className={cn('h-5 w-5', iconClassName || getIconColorClass())} />}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className={cn('pt-2', centered && 'text-center')}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {props.type === 'textarea' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="textarea-input" className="text-left">
                {props.textareaLabel || 'รายละเอียด'}
                {props.textareaRequired && <span className="text-destructive"> *</span>}
              </Label>
              <Textarea
                id="textarea-input"
                placeholder={props.textareaPlaceholder || 'กรุณากรอกข้อมูล...'}
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                rows={props.textareaRows || 4}
                className="resize-none"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {props.type === 'custom' && <div className="py-4">{props.children}</div>}

        <DialogFooter
          className={cn(centered && 'flex flex-row items-center justify-center sm:justify-center')}
        >
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={getButtonVariant()} onClick={handleConfirm} disabled={isConfirmDisabled}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Convenience wrapper components for common use cases
export function ConfirmDialog(props: Omit<SimpleDialogProps, 'type'> & { destructive?: boolean }) {
  const { destructive, ...rest } = props;
  return (
    <SharedDialog
      {...rest}
      type="simple"
      variant={destructive ? 'destructive' : rest.variant}
      icon={destructive ? AlertTriangle : rest.icon}
    />
  );
}

export function TextInputDialog(props: Omit<TextareaDialogProps, 'type'>) {
  return <SharedDialog {...props} type="textarea" />;
}

export function CustomContentDialog(props: Omit<CustomDialogProps, 'type'>) {
  return <SharedDialog {...props} type="custom" />;
}
