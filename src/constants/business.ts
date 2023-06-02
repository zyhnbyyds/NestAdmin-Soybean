/** 用户状态 */
export const userStatusLabels: Record<UserManagement.UserStatusKey, string> = {
  0: '禁用',
  1: '启用'
};

export const userStatusOptions: { value: UserManagement.UserStatusKey; label: string }[] = [
  { value: 0, label: userStatusLabels[0] },
  { value: 1, label: userStatusLabels[1] }
];
