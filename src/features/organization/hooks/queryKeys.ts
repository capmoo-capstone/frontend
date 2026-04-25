export const organizationKeys = {
  departments: ['departments'] as const,
  units: ['units'] as const,
  unitsByDepartment: (departmentId: string) => [...organizationKeys.units, departmentId] as const,
  unitsList: (page: number, limit: number) => [...organizationKeys.units, 'list', page, limit] as const,
  unitDetail: (unitId: string) => [...organizationKeys.units, 'detail', unitId] as const,
};
