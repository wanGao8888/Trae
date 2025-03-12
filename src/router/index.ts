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
      },
    },
    {
      path: '/',
      redirect: '/login',
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 检查路由是否有 hidden 属性为 true
  if (to.meta.hidden) {
    next('/home')
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
