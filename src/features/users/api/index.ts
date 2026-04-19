import api from '@/lib/axios';

import {
  type AddDelegationRequest,
  AddDelegationSchema,
  type BackendRepresentativeResponse,
  BackendRepresentativeResponseSchema,
  type BackendUpdateUserRoleResponse,
  BackendUpdateUserRoleResponseSchema,
  type BackendUserDelegationDetailResponse,
  BackendUserDelegationDetailResponseSchema,
  type BackendUserDelegationResponse,
  BackendUserDelegationResponseSchema,
  type BackendUserDetailResponse,
  BackendUserDetailResponseSchema,
  BackendUserSelectionResponseSchema,
  type GetUsersParams,
  type GetUsersSelectionParams,
  type UpdateRepresentativeRequest,
  UpdateRepresentativeRequestSchema,
  type UpdateUserRoleRequest,
  UpdateUserRoleSchema,
  type UpdateUsersToUnitRequest,
  UpdateUsersToUnitSchema,
  type UserListResponse,
  UserListResponseSchema,
  type UserSelectionResponse,
  UserSelectionResponseSchema,
} from '../types';

export const getUsers = async ({
  page = 1,
  limit = 10,
}: GetUsersParams): Promise<UserListResponse> => {
  const { data } = await api.get('/users', {
    params: {
      page,
      limit,
    },
  });

  return UserListResponseSchema.parse(data);
};

export const getUsersForSelection = async (
  params: GetUsersSelectionParams
): Promise<UserSelectionResponse> => {
  const { data } = await api.get('/users', {
    params,
  });

  const parsed = BackendUserSelectionResponseSchema.parse(data);

  const normalized = {
    id: parsed.id,
    name: parsed.name,
    entity_type: parsed.entity_type === 'all' ? 'department' : parsed.entity_type,
    data: parsed.data.map((user) => ({
      id: user.id,
      full_name: user.full_name,
      role: user.roles[0] ?? 'GUEST',
    })),
  };

  return UserSelectionResponseSchema.parse(normalized);
};

export const getUserById = async (userId: string): Promise<BackendUserDetailResponse> => {
  const { data } = await api.get(`/users/${userId}`);
  const parsed = BackendUserDetailResponseSchema.parse(data);
  return parsed;
};

export const updateUsersInUnit = async (
  request: UpdateUsersToUnitRequest
): Promise<BackendUpdateUserRoleResponse> => {
  const requestData = UpdateUsersToUnitSchema.parse(request);
  const { data } = await api.patch(`/units/${requestData.unitId}/users`, {
    new_users: requestData.newUserIds,
    remove_users: requestData.removeUserIds,
  });
  const parsed = BackendUpdateUserRoleResponseSchema.parse(data);
  return parsed;
};

export const getRepresentative = async (unitId: string): Promise<BackendRepresentativeResponse> => {
  const { data } = await api.get(`/units/${unitId}/rep`);
  const parsed = BackendRepresentativeResponseSchema.parse(data);
  return parsed;
};

export const updateRepresentative = async (
  request: UpdateRepresentativeRequest
): Promise<BackendUpdateUserRoleResponse> => {
  const requestData = UpdateRepresentativeRequestSchema.parse(request);
  const { data } = await api.patch(`/units/${requestData.unitId}/rep`, {
    new_users: [requestData.newUserId],
    remove_users: [requestData.removeUserId],
  });
  const parsed = BackendUpdateUserRoleResponseSchema.parse(data);
  return parsed;
};

export const updateSupplyRole = async (
  request: UpdateUserRoleRequest
): Promise<BackendUpdateUserRoleResponse> => {
  const { data } = await api.patch(`/users/roles/supply`, {
    role: request.role,
    new_users: request.newUserIds,
    remove_users: request.removeUserIds,
  });
  const parsed = BackendUpdateUserRoleResponseSchema.parse(data);
  return parsed;
};

export const updateUserRole = async (
  request: UpdateUserRoleRequest
): Promise<BackendUpdateUserRoleResponse> => {
  const requestData = UpdateUserRoleSchema.parse(request);

  await Promise.all([
    ...requestData.newUserIds.map((userId) =>
      api.post(`/users/${userId}/role`, {
        role: requestData.role,
        dept_id: requestData.deptId,
        unit_id: requestData.unitId,
      })
    ),
    ...requestData.removeUserIds.map((userId) =>
      api.patch(`/users/${userId}/role/remove`, {
        role: requestData.role,
        dept_id: requestData.deptId,
        unit_id: requestData.unitId,
      })
    ),
  ]);

  return {
    added: requestData.newUserIds.length,
    removed: requestData.removeUserIds.length,
  };
};

export const removeUser = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`);
};

export const addDelegation = async (
  request: AddDelegationRequest
): Promise<BackendUserDelegationResponse> => {
  const requestData = AddDelegationSchema.parse(request);
  const { data } = await api.post(`/delegations`, requestData);
  const parsed = BackendUserDelegationResponseSchema.parse(data);
  return parsed;
};

export const cancelDelegation = async (
  delegationId: string
): Promise<BackendUserDelegationResponse> => {
  const { data } = await api.patch(`/delegations/${delegationId}/cancel`);
  const parsed = BackendUserDelegationResponseSchema.parse(data);
  return parsed;
};

export const getDelegationById = async (
  delegationId: string
): Promise<BackendUserDelegationDetailResponse> => {
  const { data } = await api.get(`/delegations/${delegationId}`);
  const parsed = BackendUserDelegationDetailResponseSchema.parse(data);
  return parsed;
};

export const getActiveDelegationByUnit = async (
  unitId: string
): Promise<BackendUserDelegationDetailResponse> => {
  const { data } = await api.get(`/delegations/active?unitId=${unitId}`);
  const parsed = BackendUserDelegationDetailResponseSchema.parse(data);
  return parsed;
};
