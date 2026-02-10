import api from '@/lib/axios';
import { type Department, DepartmentsSchema } from '@/types/department';

import { MOCK_DEPARTMENTS } from './mock-data';

export const getDepartments = async (): Promise<Department[]> => {
  // return mock data;
  return MOCK_DEPARTMENTS;

  const { data } = await api.get('/department');

  return DepartmentsSchema.parse(data);
};
