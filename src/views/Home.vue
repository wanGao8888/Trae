<template>
  <div class="home">
    <search-input style="margin-bottom: 10px" />
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总用户数</span>
              <el-tag type="success">增长</el-tag>
            </div>
          </template>
          <div class="card-number">1,234</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日访问</span>
              <el-tag type="warning">持平</el-tag>
            </div>
          </template>
          <div class="card-number">423</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总订单数</span>
              <el-tag type="success">增长</el-tag>
            </div>
          </template>
          <div class="card-number">5,678</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待处理</span>
              <el-tag type="danger">紧急</el-tag>
            </div>
          </template>
          <div class="card-number">89</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import SearchInput from '@/components/Input/SearchInput.vue'
</script>

<style scoped>
.home {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-number {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-top: 10px;
}

.el-card {
  margin-bottom: 20px;
}
</style>
