import { request } from '../request';

export function fetchGetRoleList(params?: ApiCommon.SearchQuery) {
  return request.get<ApiRole.RoleRes>('/role/list', { params });
}

export function fetchEditRole(params: ApiRole.RoleEdit) {
  return request.put('/role/edit', params);
}

export function fetchAddRole(params: ApiRole.RoleAdd) {
  return request.post('/role/add', params);
}

export function fetchDeleteRole(id: number) {
  return request.delete('/role/del', { params: { id } });
}

/**
 * 获取角色下的权限数字集合
 * @param roleId 角色id
 * @returns 权限id集合
 */
export function fetchGetRoleMenuList(roleId: number) {
  return request.post<ApiRole.RoleMenuIds>('/role/auth/list', { roleId });
}
