import type { ReactNode } from 'react';

import { Pencil, Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface InlineActionRowProps {
  label: ReactNode;
  isEditing: boolean;
  viewContent: ReactNode;
  editContent: ReactNode;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  disableSave?: boolean;
  isSaving?: boolean;
}

export function InlineActionRow({
  label,
  isEditing,
  viewContent,
  editContent,
  onEdit,
  onSave,
  onCancel,
  disableSave = false,
  isSaving = false,
}: InlineActionRowProps) {
  if (isEditing) {
    return (
      <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="normal-b w-full pt-0 wrap-break-word sm:max-w-72 sm:pt-2">{label}</div>
        <div className="w-full min-w-0 flex-1">{editContent}</div>
        <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onSave}
            disabled={disableSave || isSaving}
            aria-label="save"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onCancel}
            disabled={isSaving}
            aria-label="cancel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 py-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="normal-b w-full wrap-break-word sm:max-w-72">{label}</div>
      <div className="normal text-primary w-full min-w-0 wrap-break-word sm:flex-1">
        {viewContent}
      </div>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onEdit}
        aria-label="edit"
        className="self-end sm:self-auto"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
