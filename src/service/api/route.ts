import { request } from '../request';

export function fetchAddRoute(params: RouteManagement.AddRouteParams) {
  return request.post('/menu/add', params);
}

export function fetchEditRoute(params: RouteManagement.EditRouteParams) {
  return request.put('/menu/edit', params);
}

export function fetchDeleteRoute(id: number) {
  return request.delete('/menu/delete', { params: { id } });
}

export function fetchGetAllRoute() {
  return request.post<RouteManagement.RouteRes>('/menu/list/');
}
