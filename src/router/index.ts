import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        requiresAuth: true,
        title: '首页',
        iconCode: 'e867',
      },
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import('@/views/Detail.vue'),
      meta: {
        requiresAuth: true,
        title: '详情管理',
        iconCode: 'e673',
      },
    },
    {
      path: '/image-converter',
      name: 'imageConverter',
      component: () => import('@/views/ImageConverter.vue'),
      meta: {
        requiresAuth: true,
        title: '图片转换',
        iconCode: 'e6ec',
      },
    },
    {
      path: '/house-detail',
      name: 'houseDetail',
      component: () => import('@/views/HouseDetail.vue'),
      meta: {
        requiresAuth: true,
        title: '房屋详情',
        iconCode: 'e639',
      },
    },
    {
      path: '/photo-wall',
      name: 'photoWall',
      component: () => import('@/views/PhotoWall.vue'),
      meta: {
        requiresAuth: true,
        title: '照片墙',
        iconCode: 'e600',
      },
    },
    {
      path: '/tree-demo',
      name: 'TreeDemo',
      component: () => import('@/views/TreeDemo.vue'),
      meta: {
        requiresAuth: true,
        hidden: true,
        title: '树结构Demo',
        iconCode: 'e867',
      },
    },
    {
      path: '/map',
      name: 'MapPage',
      component: () => import('@/views/MapPage.vue'),
      meta: {
        requiresAuth: true,
        title: '地图页面',
        iconCode: 'e67e',
      },
    },
    {
      path: '/file-uploader',
      name: 'fileUploader',
      component: () => import('@/views/FileUploader.vue'),
      meta: {
        // requiresAuth: true,
        title: '文件上传',
        iconCode: 'e609',
      },
    },
    {
      path: '/',
      redirect: '/login',
    },
    // 添加 404 路由配置
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        title: '404',
        hidden: true,
      },
    },
    {
      path: '/check-list',
      name: 'CheckList',
      meta: {
        requiresAuth: true,
        title: '清单管理',
        iconCode: 'e627',
      },
      children: [
        {
          path: 'list',
          name: 'CheckListMain',
          component: () => import('@/views/CheckList.vue'),
          meta: {
            requiresAuth: true,
            title: '清单列表',
          },
        },
        {
          path: 'edit',
          name: 'CheckListEdit',
          component: () => import('@/views/CheckListEdit.vue'),
          meta: {
            requiresAuth: true,
            title: '清单编辑',
          },
        },
      ],
    },
    {
      path: '/dev-issues',
      name: 'DevIssues',
      component: () => import('../views/DevIssues.vue'),
      meta: {
        title: '开发问题记录',
        requiresAuth: true,
        iconCode: 'e627',
      },
    },
    {
      path: '/code-test',
      name: 'CodeTest',
      component: () => import('@/views/CodeTest.vue'),
      meta: {
        requiresAuth: true,
        title: '代码测试',
        iconCode: 'e6d4',
      },
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 检查路由是否存在或是否为隐藏路由（排除 404 页面）
  if (to.meta.hidden && to.name !== 'NotFound') {
    next({
      name: 'NotFound',
      params: { pathMatch: to.path.substring(1).split('/') },
      query: to.query,
      hash: to.hash,
    })
    return
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next('/login')
    } else {
      next()
    }
  } else if (to.path === '/login') {
    if (token) {
      next('/home')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
