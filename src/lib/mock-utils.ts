import type { Role, User } from '@/features/auth';

/**
 * Helper to create a mock user for testing and mock data
 * Used across various mock data files to maintain consistency
 */
export const createMockUser = (
  id: string,
  username: string,
  fullName: string,
  role: Role,
  deptId?: string,
  deptName?: string,
  unitId?: string,
  unitName?: string
): User => ({
  id,
  username,
  full_name: fullName,
  is_delegated: false,
  roles: {
    own: [
      {
        role,
        dept_id: deptId || null,
        dept_name: deptName || null,
        unit_id: unitId || null,
        unit_name: unitName || null,
      },
    ],
    delegated: [],
  },
});
