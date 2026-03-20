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
      <div className="flex items-start justify-between gap-4 py-3">
        <div className="w-full max-w-72 pt-2 text-sm font-medium">{label}</div>
        <div className="flex-1">{editContent}</div>
        <div className="flex items-center gap-1">
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
    <div className="group flex items-center justify-between gap-4 py-3">
      <div className="w-full max-w-72 text-sm">{label}</div>
      <div className="flex-1 text-sm text-slate-600">{viewContent}</div>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onEdit}
        className="opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="edit"
      >
        <Pencil className="h-4 w-4 text-slate-400 hover:text-slate-600" />
      </Button>
    </div>
  );
}
