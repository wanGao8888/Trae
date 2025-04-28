<template>
  <div class="sidebar">
    <div class="logo">管理系统</div>
    <el-menu
      :default-active="activeMenu"
      :router="true"
      :unique-opened="true"
      background-color="#304156"
      text-color="#fff"
      active-text-color="#409EFF"
    >
      <template v-for="route in menuRoutes" :key="route.path">
        <!-- 有子菜单的情况 -->
        <el-sub-menu
          v-if="route.children && route.children.length"
          :index="route.path"
        >
          <template #title>
            <Icon :code="route.meta?.iconCode" color="#ccc" class="icon" />
            <span>{{ route.meta?.title }}</span>
          </template>
          <el-menu-item
            v-for="child in route.children"
            :key="child.path"
            :index="`${route.path}${child.path ? '/' + child.path : ''}`"
          >
            <span>{{ child.meta?.title }}</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 没有子菜单的情况 -->
        <el-menu-item v-else :index="route.path">
          <Icon :code="route.meta?.iconCode" color="#ccc" class="icon" />
          <span>{{ route.meta?.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import Icon from '../Icon/Icon.vue'

const route = useRoute()
const router = useRouter()

// 修改获取菜单路由的逻辑
const menuRoutes = computed(() => {
  // 过滤需要显示在菜单中的路由
  return router.options.routes.filter((route) => {
    return route.meta?.requiresAuth && !route.meta?.hidden
  })
})

const activeMenu = computed(() => {
  return route.path
})
</script>

<style scoped>
.sidebar {
  height: 100%;
  background-color: #304156;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  color: white;
  border-bottom: 1px solid #1f2d3d;
}

.icon {
  margin-right: 10px;
}

.menu {
  border-right: none;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-sub-menu__title) {
  &:hover {
    background-color: #263445 !important;
  }
}

:deep(.el-menu-item) {
  &:hover {
    background-color: #263445 !important;
  }

  &.is-active {
    background-color: #263445 !important;
  }
}
</style>
