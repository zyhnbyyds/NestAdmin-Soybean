const plugin: AuthRoute.Route = {
  name: 'plugin',
  path: '/plugin',
  component: 'basic',
  children: [
    {
      name: 'plugin_charts',
      path: '/plugin/charts',
      component: 'multi',
      children: [
        {
          name: 'plugin_charts_echarts',
          path: '/plugin/charts/echarts',
          component: 'self',
          meta: {
            title: 'ECharts',
            requiresAuth: true,
            icon: 'simple-icons:apacheecharts',
            type: 'M'
          }
        },
        {
          name: 'plugin_charts_antv',
          path: '/plugin/charts/antv',
          component: 'self',
          meta: {
            title: 'AntV',
            requiresAuth: true,
            icon: 'simple-icons:antdesign',
            type: 'M'
          }
        }
      ],
      meta: {
        title: '图表',
        icon: 'mdi:chart-areaspline',
        type: 'M'
      }
    },
    {
      name: 'plugin_map',
      path: '/plugin/map',
      component: 'self',
      meta: {
        title: '地图',
        requiresAuth: true,
        icon: 'mdi:map',
        type: 'M'
      }
    },
    {
      name: 'plugin_video',
      path: '/plugin/video',
      component: 'self',
      meta: {
        title: '视频',
        requiresAuth: true,
        icon: 'mdi:video',
        type: 'M'
      }
    },
    {
      name: 'plugin_editor',
      path: '/plugin/editor',
      component: 'multi',
      children: [
        {
          name: 'plugin_editor_quill',
          path: '/plugin/editor/quill',
          component: 'self',
          meta: {
            title: '富文本编辑器',
            requiresAuth: true,
            icon: 'mdi:file-document-edit-outline',
            type: 'M'
          }
        },
        {
          name: 'plugin_editor_markdown',
          path: '/plugin/editor/markdown',
          component: 'self',
          meta: {
            title: 'markdown编辑器',
            requiresAuth: true,
            icon: 'ri:markdown-line',
            type: 'M'
          }
        }
      ],
      meta: {
        title: '编辑器',
        icon: 'icon-park-outline:editor',
        type: 'M'
      }
    },
    {
      name: 'plugin_swiper',
      path: '/plugin/swiper',
      component: 'self',
      meta: {
        title: 'Swiper插件',
        requiresAuth: true,
        icon: 'simple-icons:swiper',
        type: 'M'
      }
    },
    {
      name: 'plugin_copy',
      path: '/plugin/copy',
      component: 'self',
      meta: {
        title: '剪贴板',
        requiresAuth: true,
        icon: 'mdi:clipboard-outline',
        type: 'M'
      }
    },
    {
      name: 'plugin_icon',
      path: '/plugin/icon',
      component: 'self',
      meta: {
        title: '图标',
        requiresAuth: true,
        localIcon: 'custom-icon',
        type: 'M'
      }
    },
    {
      name: 'plugin_print',
      path: '/plugin/print',
      component: 'self',
      meta: {
        title: '打印',
        requiresAuth: true,
        icon: 'mdi:printer',
        type: 'M'
      }
    }
  ],
  meta: {
    title: '插件示例',
    icon: 'clarity:plugin-line',
    order: 4,
    type: 'T'
  }
};

export default plugin;
