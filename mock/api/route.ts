import type { MockMethod } from 'vite-plugin-mock';
import { routeModel, userModel } from '../model';

const apis: MockMethod[] = [
  {
    url: '/mock/getUserRoutes',
    method: 'post',
    response: (options: Service.MockOption): Service.MockServiceResult => {
      const { id = undefined } = options.body;

      const routeHomeName: AuthRoute.LastDegreeRouteKey = 'dashboard_analysis';

      const role = userModel.find(item => item.id === id)?.userRole || 'user';

      const filterRoutes = routeModel[role];

      return {
        code: 200,
        message: 'ok',
        data: {
          routes: filterRoutes,
          home: routeHomeName
        }
      };
    }
  }
];

export default apis;
