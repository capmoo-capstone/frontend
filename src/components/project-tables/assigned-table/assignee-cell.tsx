'use client';

import { useState } from 'react';

import { Pencil, Save, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { UserSelect } from '@/components/user-select';
import { useChangeProjectAssignee } from '@/hooks/useProjects';

interface AssigneeCellProps {
  rowId: string;
  full_name: string | null;
  originalValue: string | null;
  unitId?: string;
  status: string;
}

export function AssigneeCell({
  rowId,
  full_name,
  originalValue,
  unitId,
  status,
}: AssigneeCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState<string | null>(originalValue);

  const { mutateAsync } = useChangeProjectAssignee();

  const handleSave = async () => {
    if (!currentValue) {
      toast.error('Please select a user');
      return;
    }

    if (currentValue === originalValue) {
      setIsEditing(false);
      return;
    }

    const savePromise = mutateAsync({
      projectId: rowId,
      userId: currentValue,
    });

    toast.promise(savePromise, {
      loading: 'Updating assignee...',
      success: 'Assignee updated successfully!',
      error: (err) => `Error: ${err.message}`,
    });

    try {
      await savePromise;
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setCurrentValue(originalValue);
    setIsEditing(false);
  };

  const isEditable = status === 'WAITING_FOR_ACCEPTANCE';

  return (
    <div className="flex min-w-64 items-center justify-between gap-2">
      {isEditing ? (
        // --- Edit Mode ---
        <div className="flex w-full items-center gap-2">
          <UserSelect
            value={currentValue}
            unitId={unitId}
            onChange={setCurrentValue}
            className="h-8 flex-1 text-sm w-48"
            hasClearButton={false}
          />
          <div className="flex items-center gap-1">
            <Button variant="brand" size="icon" className="h-8 w-8" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        // --- View Mode ---
        <div className="group flex w-full items-center justify-between">
          <span className="truncate text-sm font-medium">{full_name || '-'}</span>

          {isEditable && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="text-muted-foreground h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
