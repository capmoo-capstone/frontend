export interface UserRoleSelection {
  roles?: readonly string[] | null;
}

export const getUserSelectionRoles = (user: UserRoleSelection): string[] => {
  const roles = user.roles?.filter(Boolean) ?? [];

  if (roles.length > 0) {
    return Array.from(new Set(roles));
  }

  return [];
};

export const hasUserSelectionRole = (user: UserRoleSelection, role: string): boolean => {
  return getUserSelectionRoles(user).includes(role);
};

export const hasAnyUserSelectionRole = (
  user: UserRoleSelection,
  rolesToMatch: readonly string[]
): boolean => {
  const roles = getUserSelectionRoles(user);

  return rolesToMatch.some((role) => roles.includes(role));
};
