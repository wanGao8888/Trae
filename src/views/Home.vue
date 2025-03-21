<template>
  <div class="home">
    <search-input style="margin-bottom: 10px" />
    <Switch
      style="margin-bottom: 10px"
      v-model="switchValue"
      @update:model-value="handleChange"
    />
    <DatePicker
      style="margin-bottom: 10px"
      v-model="date"
      type="date"
      placeholder="选择日期"
      :disabled-before-today="false"
      @change="handleDateChange"
    />
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
import SearchInput from '@/components/SearchInput.vue'
import Switch from '@/components/Switch.vue'
import { ref, watch, computed } from 'vue'
import DatePicker from '@/components/DatePicker.vue'

const date = ref('')

const switchValue = ref(false)

// watch(switchValue, (newValue) => {
//   console.log(switchValue.value, 'switchValue', newValue)
// })
// const switchStatus = computed(() => {
//   console.log('开关状态：', switchValue.value)
//   return switchValue.value ? '开启' : '关闭'
// })
const handleChange = (val) => {
  // console.log(val, 'val', switchStatus.value)
}

const handleDateChange = (value) => {
  console.log('选择的日期：', value)
}
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
