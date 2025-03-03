<template>
  <div class="sidebar">
    <div class="logo">管理系统</div>
    <el-menu
      :default-active="activeMenu"
      :router="true"
      :unique-opened="true"
      background-color="#304156"
      text-color="#fff"
      active-text-color="#409EFF">
      <el-menu-item 
        v-for="route in menuRoutes" 
        :key="route.path"
        :index="route.path"
      >
        <el-icon>
          <component :is="route.meta?.icon"/>
        </el-icon>
        <span>{{ route.meta?.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

// 修改获取菜单路由的逻辑
const menuRoutes = computed(() => {
  // 过滤需要显示在菜单中的路由
  return router.options.routes.filter(route => {
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

.menu {
  border-right: none;
}

:deep(.el-menu) {
  border-right: none;
}
</style>