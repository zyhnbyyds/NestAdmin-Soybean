import { request } from '../request';

/** 获取用户列表 */
export function fetchGetUserList(searchQuery: ApiCommon.SearchQuery) {
  return request.get<UserManagement.UserListRes>('/user/list', { params: searchQuery });
}

/** 修改用户 */
export function fetchEditUser<T>(params: T) {
  return request.put('/user/edit', params);
}

/** 添加用户 */
export function fetchAddUser<T>(params: T) {
  return request.post('/user/add', params);
}

/** 删除用户 */
export function fetchDeleteUser(id: number) {
  return request.delete('/user/del', { params: { id } });
}

/** 删除多个用户 */
export function fetchDeleteUserMany(ids: number[]) {
  return request.delete('/user/del/delMany', { params: { ids } });
}
