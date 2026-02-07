import { type ColumnDef } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import type { UserSelectionItem } from '@/types/user';

interface GetColumnsProps {
  onDeleteMember: (user: UserSelectionItem) => void;
  isEditing: boolean;
}

export const getColumns = ({
  onDeleteMember,
  isEditing,
}: GetColumnsProps): ColumnDef<UserSelectionItem>[] => [
  {
    id: 'full_name',
    header: 'ชื่อ-นามสกุล',
    cell: ({ row }) => {
      const member = row.original as UserSelectionItem & { isNew?: boolean };

      return (
        <span
          className={cn('normal', member.isNew ? 'text-info-dark font-medium' : 'text-primary')}
        >
          {member.full_name}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'ลบสมาชิก',
    cell: ({ row }) => {
      if (!isEditing) return null;
      return (
        <div className="normal-b text-destructive" onClick={() => onDeleteMember(row.original)}>
          ลบสมาชิก
        </div>
      );
    },
  },
];
