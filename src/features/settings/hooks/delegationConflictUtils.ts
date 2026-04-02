export const hasDelegatedRoleMemberConflict = (
  delegatedUserIds: Set<string>,
  roles: Array<{ id: string; member_ids: string[] }>,
  currentRoleId: string
) => {
  return roles
    .filter((item) => item.id !== currentRoleId)
    .some((item) => item.member_ids.some((memberId) => delegatedUserIds.has(memberId)));
};

export const hasDelegatedHeadConflict = (
  delegatedUserId: string,
  groups: Array<{ id: string; head_id: string }>,
  currentGroupId: string
) => {
  return groups
    .filter((item) => item.id !== currentGroupId)
    .some((item) => item.head_id === delegatedUserId);
};
