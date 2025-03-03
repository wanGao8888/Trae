<template>
  <div class="header">
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <el-button type="primary" plain>
          {{ username }}
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
            <el-dropdown-item command="password">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '管理员')

const handleCommand = (command: string) => {
  if (command === 'logout') {
    ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      router.push('/login')
      ElMessage.success('已退出登录')
    }).catch(() => {})
  }
}
</script>

<style scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}
</style>