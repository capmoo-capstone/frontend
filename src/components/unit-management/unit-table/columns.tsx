import { type ColumnDef } from '@tanstack/react-table';

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
    cell: ({ row }) => <div className="text-normal-normal">{row.original.full_name}</div>,
  },
  {
    id: 'actions',
    header: 'ลบสมาชิก',
    cell: ({ row }) => {
      if (!isEditing) return null;
      return (
        <div
          className="text-normal-bold text-destructive"
          onClick={() => onDeleteMember(row.original)}
        >
          ลบสมาชิก
        </div>
      );
    },
  },
];
