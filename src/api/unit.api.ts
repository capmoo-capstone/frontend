import api from '@/lib/axios';
import { type Unit, UnitListSchema } from '@/types/unit';

import { MOCK_UNITS } from './mock-data';

export const getUnits = async (): Promise<Unit[]> => {
  // return mock data;
  return MOCK_UNITS;

  const { data } = await api.get('/unit');

  return UnitListSchema.parse(data);
};

export const addMemberToUnit = async (unitId: string, userId: string) => {
  // return mock response
  return {
    success: true,
    unitId,
    userId,
  };
  const { data } = await api.patch(`/unit/${unitId}/add-users`, { user_id: userId });
  return data;
};

export const updateUnit = async (unitId: string, updateData: Partial<Unit>) => {
  // return mock response
  return {
    success: true,
    unitId,
    updateData,
  };
  const { data } = await api.put(`/unit/${unitId}`, updateData);
  return data;
};
