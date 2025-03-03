<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">
        <h2>后台管理系统</h2>
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="用户名：admin"
            :prefix-icon="User">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="密码：123456"
            :prefix-icon="Lock"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" class="login-button">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const loginFormRef = ref<FormInstance>()

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ]
})

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        if (loginForm.username === 'admin' && loginForm.password === '123456') {
          localStorage.setItem('token', 'mock-token')
          localStorage.setItem('username', loginForm.username)
          router.push('/home')  // 修改这里的跳转路径
          ElMessage.success('登录成功')
        } else {
          ElMessage.error('用户名或密码错误')
        }
        loading.value = false
      }, 1000)
    }
  })
}
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom right, #50a3a2 0%, #53e3a6 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
}

.login-title h2 {
  margin: 0;
  color: #409EFF;
  font-size: 26px;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
  height: 45px;
  font-size: 16px;
}

:deep(.el-input__wrapper) {
  height: 45px;
}

:deep(.el-form-item) {
  margin-bottom: 25px;
}
</style>