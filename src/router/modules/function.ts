const functionRoute: AuthRoute.Route = {
  name: 'function',
  path: '/function',
  component: 'basic',
  children: [
    {
      name: 'function_tab',
      path: '/function/tab',
      component: 'self',
      meta: {
        title: 'Tab',
        requiresAuth: true,
        icon: 'ic:round-tab',
        type: 'M'
      }
    },
    {
      name: 'function_tab-detail',
      path: '/function/tab-detail',
      component: 'self',
      meta: {
        title: 'Tab Detail',
        requiresAuth: true,
        hide: true,
        activeMenu: 'function_tab',
        icon: 'ic:round-tab',
        type: 'M'
      }
    },
    {
      name: 'function_tab-multi-detail',
      path: '/function/tab-multi-detail',
      component: 'self',
      meta: {
        title: 'Tab Multi Detail',
        requiresAuth: true,
        hide: true,
        multiTab: true,
        activeMenu: 'function_tab',
        icon: 'ic:round-tab',
        type: 'M'
      }
    }
  ],
  meta: {
    title: '功能',
    icon: 'icon-park-outline:all-application',
    order: 6,
    type: 'T'
  }
};

export default functionRoute;
