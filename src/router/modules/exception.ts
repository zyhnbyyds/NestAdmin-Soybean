const exception: AuthRoute.Route = {
  name: 'exception',
  path: '/exception',
  component: 'basic',
  children: [
    {
      name: 'exception_403',
      path: '/exception/403',
      component: 'self',
      meta: {
        title: '异常页403',
        requiresAuth: true,
        icon: 'ic:baseline-block',
        type: 'M'
      }
    },
    {
      name: 'exception_404',
      path: '/exception/404',
      component: 'self',
      meta: {
        title: '异常页404',
        requiresAuth: true,
        icon: 'ic:baseline-web-asset-off',
        type: 'M'
      }
    },
    {
      name: 'exception_500',
      path: '/exception/500',
      component: 'self',
      meta: {
        title: '异常页500',
        requiresAuth: true,
        icon: 'ic:baseline-wifi-off',
        type: 'M'
      }
    }
  ],
  meta: {
    title: '异常页',
    icon: 'ant-design:exception-outlined',
    order: 7,
    type: 'T'
  }
};

export default exception;
