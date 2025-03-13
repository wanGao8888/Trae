import { createRouter, createWebHistory } from 'vue-router'

// 首先在路由配置中添加 title 和 icon 信息
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
        icon: 'HomeFilled',
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
        icon: 'Document',
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
        icon: 'Picture',
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
        icon: 'House',
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
        icon: 'Picture',
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
        icon: 'Tree',
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
        icon: 'Location',
        iconCode: 'e67e',
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
