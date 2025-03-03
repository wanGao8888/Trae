<template>
  <el-container class="layout">
    <el-aside width="280px">
      <Sidebar />
    </el-aside>
    <el-container>
      <el-header height="60px">
        <Header />
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
</script>

<style scoped>
.layout {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
  height: 100vh;
  overflow: hidden;
}

.el-header {
  padding: 0;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}

:deep(.el-container) {
  height: 100%;
}
</style>