const document: AuthRoute.Route = {
  name: 'document',
  path: '/document',
  component: 'basic',
  children: [
    {
      name: 'document_vue',
      path: '/document/vue',
      component: 'self',
      meta: {
        title: 'vue文档',
        requiresAuth: true,
        icon: 'logos:vue',
        type: 'M'
      }
    },
    {
      name: 'document_vite',
      path: '/document/vite',
      component: 'self',
      meta: {
        title: 'vite文档',
        requiresAuth: true,
        icon: 'logos:vitejs',
        type: 'M'
      }
    },
    {
      name: 'document_naive',
      path: '/document/naive',
      component: 'self',
      meta: {
        title: 'naive文档',
        requiresAuth: true,
        icon: 'logos:naiveui',
        type: 'M'
      }
    },
    {
      name: 'document_project',
      path: '/document/project',
      component: 'self',
      meta: {
        title: '项目文档',
        requiresAuth: true,
        localIcon: 'logo',
        type: 'M'
      }
    },
    {
      name: 'document_project-link',
      path: '/document/project-link',
      meta: {
        title: '项目文档(外链)',
        requiresAuth: true,
        localIcon: 'logo',
        href: 'https://docs.soybean.pro/',
        type: 'M'
      }
    }
  ],
  meta: {
    title: '文档',
    icon: 'mdi:file-document-multiple-outline',
    order: 2,
    type: 'T'
  }
};

export default document;
