<template>
  <div class="custom-date-picker">
    <el-date-picker
      v-model="dateValue"
      :type="type"
      :placeholder="placeholder"
      :format="format"
      :value-format="valueFormat"
      :disabled="disabled"
      :clearable="clearable"
      :shortcuts="enableShortcuts ? defaultShortcuts : []"
      :disabled-date="disabledDate"
      :size="size"
      :style="{ width }"
      :first-day-of-week="1"
      @change="handleChange"
    >
      <template #default="cell">
        <slot name="date-cell" :cell="cell">
          <div :class="{ 'is-today': isToday(cell.date) }">
            {{ cell.text }}
          </div>
        </slot>
      </template>
    </el-date-picker>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'  // 添加中文语言包

// 设置 dayjs 为中文
dayjs.locale('zh-cn')

interface Props {
  modelValue?: string | number | Date
  type?: 'date' | 'datetime' | 'week' | 'month' | 'year' | 'dates'
  placeholder?: string
  format?: string
  valueFormat?: string
  disabled?: boolean
  clearable?: boolean
  enableShortcuts?: boolean
  size?: 'large' | 'default' | 'small'
  width?: string
  disabledBeforeToday?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'date',
  placeholder: '请选择日期',
  format: 'YYYY-MM-DD',
  valueFormat: 'YYYY-MM-DD',
  disabled: false,
  clearable: true,
  enableShortcuts: true,
  size: 'default',
  width: '220px',
  disabledBeforeToday: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}>()

const dateValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 快捷选项
const defaultShortcuts = [
  {
    text: '今天',
    value: new Date()
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    }
  },
  {
    text: '一周前',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    }
  },
  {
    text: '一个月前',
    value: () => {
      const date = new Date()
      date.setMonth(date.getMonth() - 1)
      return date
    }
  }
]

// 禁用日期
const disabledDate = (time: Date) => {
  if (props.disabledBeforeToday) {
    return time.getTime() < dayjs().startOf('day').valueOf()
  }
  return false
}

// 判断是否为今天
const isToday = (date: Date) => {
  return dayjs(date).isSame(dayjs(), 'day')
}

// 日期变化处理
const handleChange = (value: any) => {
  emit('change', value)
}
</script>

<style scoped>
.custom-date-picker {
  display: inline-block;
}

:deep(.el-date-picker__header-label) {
  font-size: 16px;
  font-weight: bold;
}

:deep(.el-date-table td.today .cell) {
  color: var(--el-color-primary);
  font-weight: bold;
}

:deep(.el-date-table td.current .cell) {
  background-color: var(--el-color-primary);
  color: #fff;
  border-radius: 4px;
}

:deep(.el-picker-panel__shortcut) {
  color: var(--el-color-primary);
  font-size: 13px;
}

:deep(.el-date-picker__header-label),
:deep(.el-date-picker__week-list) {
  font-size: 14px;
}

:deep(.el-picker-panel) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
}

:deep(.el-date-picker__header),
:deep(.el-date-table thead),
:deep(.el-date-table tbody),
:deep(.el-picker-panel__shortcut),
:deep(.el-date-picker__header-label) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
}
</style>