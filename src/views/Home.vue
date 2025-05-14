<template>
  <div class="home">
    <search-input style="margin-bottom: 10px" />
    <div>
      <cascader-with-description v-model="cascaderValue" :options="options" />
    </div>
    <DatePickerCN v-model="defaultValue" />
    <div style="margin: 10px 0">
      <advanced-cascader v-model="selectedValues" :options="options1" />
    </div>
    <TimePickerStep v-model="time" />
    <Switch
      style="margin-bottom: 10px"
      v-model="switchValue"
      @update:model-value="handleChange"
    />
    <div class="time-range-picker">
      <el-time-select
        v-model="timeRange.start"
        start="00:00"
        step="00:30"
        end="23:30"
        placeholder="开始时间"
        class="time-select"
      />
      <span class="separator">To</span>
      <el-time-select
        v-model="timeRange.end"
        start="00:00"
        step="00:30"
        end="23:30"
        placeholder="结束时间"
        class="time-select"
        :min-time="timeRange.start"
      />
    </div>
    <CustomDatePicker
      style="margin-bottom: 20px"
      v-model="selectedDate"
      type="datetime"
      format="YYYY-MM-DD HH:mm"
      :show-time="false"
      placeholder="请选择日期时间"
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
import TimePickerStep from '@/components/TimePickerStep/index.vue'
import CustomDatePicker from '@/components/DatePicker/index.vue'
import DatePickerCN from '@/components/DatePickerCN/index.vue'
import CascaderWithDescription from '@/components/CascaderWithDescription.vue'
import AdvancedCascader from '@/components/AdvancedCascader.vue'

const time = ref('')
const cascaderValue = ref({
  items: [],
})

const selectedDate = ref(new Date()) // 设置默认值为当前日期
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'shejiyuanze',
        label: '设计原则',
        children: [
          {
            value: 'yizhi',
            label: '一致',
          },
        ],
      },
    ],
  },
  {
    value: 'zhinan2',
    label: '指南2',
    children: [
      {
        value: 'shejiyuanze2',
        label: '设计原则2',
        children: [
          {
            value: 'yizhi2',
            label: '一致2',
          },
        ],
      },
    ],
  },
]

const selectedValues = ref([])

const options1 = [
  {
    value: '1',
    label: '选项1',
    children: [
      {
        value: '1-1',
        label: '选项1-1',
      },
      {
        value: '1-2',
        label: '选项1-2',
      },
    ],
  },
  {
    value: '2',
    label: '选项2',
    children: [
      {
        value: '2-1',
        label: '选项2-1',
      },
      {
        value: '2-2',
        label: '选项2-2',
      },
    ],
  },
  {
    value: '3',
    label: '选项3',
    children: [
      {
        value: '3-1',
        label: '选项3-1',
      },
      {
        value: '3-2',
        label: '选项3-2',
      },
      {
        value: '3-3',
        label: '选项3-3',
      },
    ],
  },
]

const handleDateChange = (value) => {
  console.log('选择的日期：', value)
}

const switchValue = ref(false)

const disabledMinutes = () => {
  const minutes = []
  for (let i = 0; i < 60; i++) {
    if (i !== 0 && i !== 30) {
      minutes.push(i)
    }
  }
  return minutes
}

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

// 修改时间相关的数据结构
const timeRange = ref({
  start: '',
  end: '',
})

// 生成时间选项
const timeOptions = ref([])
for (let hour = 0; hour < 24; hour++) {
  const hourStr = hour.toString().padStart(2, '0')
  timeOptions.value.push({
    label: `${hourStr}:00`,
    value: `${hourStr}:00`,
  })
  timeOptions.value.push({
    label: `${hourStr}:30`,
    value: `${hourStr}:30`,
  })
}

// 可以添加一个监听函数来处理时间段变化
watch(
  timeRange,
  (newValue) => {
    console.log('时间段变化：', newValue)
  },
  { deep: true }
)
watch(
  cascaderValue,
  (newValue) => {
    console.log('级联选择器值变化：', newValue)
  },
  { deep: true }
)
const defaultValue = ref('')
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
.el-select {
  width: 180px;
}

.time-range-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  background: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  width: fit-content;
}

.time-select {
  width: 160px;
}

.separator {
  color: #606266;
  font-size: 14px;
  padding: 0 4px;
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: none;
  padding: 0 8px;
}

:deep(.el-input__inner) {
  font-size: 14px;
  color: #606266;
}

:deep(.el-select-dropdown__item) {
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
}

:deep(.el-time-select__item.selected) {
  color: #409eff;
  font-weight: bold;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: none !important;
}
</style>
