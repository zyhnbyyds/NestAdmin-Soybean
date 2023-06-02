const about1: AuthRoute.Route = {
  name: 'about',
  path: '/about',
  component: 'self',
  meta: {
    title: '关于',
    requiresAuth: true,
    singleLayout: 'basic',
    permissions: ['super', 'admin', 'user'],
    icon: 'fluent:book-information-24-regular',
    order: 10,
    type: 'T'
  }
};

export default about1;
