<template>
  <div class="date-picker">
    <div class="date-input" @click="togglePanel">
      <input
        :value="formatDate(selectedDate)"
        readonly
        :placeholder="placeholder"
      />
      <span class="calendar-icon">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </span>
    </div>

    <div v-if="showPanel" class="date-panel">
      <div class="panel-content">
        <YearMonthPanel
          v-if="!showTimeSelect"
          :current-year="currentYear"
          :current-month="currentMonth"
          @update-year="changeYear"
          @update-month="changeMonth"
          @select-year="selectYear"
          @select-month="selectMonth"
        />

        <div v-if="!showTimeSelect" class="calendar-body">
          <div class="weekdays">
            <span
              v-for="day in ['日', '一', '二', '三', '四', '五', '六']"
              :key="day"
            >
              {{ day }}
            </span>
          </div>

          <div class="days">
            <div
              v-for="day in calendarDays"
              :key="day.date"
              class="day"
              :class="{
                'other-month': day.otherMonth,
                selected: isSelected(day.date),
                today: isToday(day.date),
                disabled: isDisabled(day.date),
              }"
              @click="!isDisabled(day.date) && selectDate(day.date)"
            >
              {{ day.dayOfMonth }}
            </div>
          </div>
        </div>

        <TimePanel
          v-if="showTime"
          v-model="selectedTime"
          :initial-time="selectedTime"
          @update:modelValue="handleTimeChange"
          @toggle-time-select="handleTimeSelectToggle"
        />

        <div class="panel-footer">
          <button class="btn-confirm" @click="confirmSelect">确定</button>
          <button class="btn-cancel" @click="showPanel = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import dayjs from 'dayjs'
import YearMonthPanel from './YearMonthPanel.vue'
import TimePanel from './TimePanel.vue'

interface Props {
  modelValue?: Date | [Date, Date]
  placeholder?: string
  format?: string
  type?: 'date' | 'datetime' | 'daterange' | 'datetimerange'
  showTime?: boolean
  disabledDate?: (date: Date) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择日期',
  format: 'YYYY-MM-DD',
  type: 'date',
  showTime: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date): void
  (e: 'change', value: Date): void
}>()

// 在 ref 变量声明处添加临时日期变量
const showPanel = ref(false)
const currentDate = ref(dayjs())
const tempSelectedDate = ref<dayjs.Dayjs | null>(null) // 新增：临时选中的日期
const selectedDate = computed({
  get: () => (props.modelValue ? dayjs(props.modelValue as Date) : null),
  set: (value) => emit('update:modelValue', value?.toDate()),
})

// 修改 selectDate 方法
const selectDate = (date: dayjs.Dayjs) => {
  tempSelectedDate.value = date // 只更新临时选中的日期
  if (!props.showTime) {
    confirmSelect() // 如果不显示时间选择器，则直接确认
  }
}

// 修改 confirmSelect 方法
const confirmSelect = () => {
  if (tempSelectedDate.value) {
    if (props.showTime) {
      const [hours, minutes] = selectedTime.value.split(':')
      const finalDate = tempSelectedDate.value
        .hour(parseInt(hours))
        .minute(parseInt(minutes))
      selectedDate.value = finalDate
      emit('change', finalDate.toDate())
    } else {
      selectedDate.value = tempSelectedDate.value
      emit('change', tempSelectedDate.value.toDate())
    }
  }
  showPanel.value = false
  tempSelectedDate.value = null
}

// 修改 isSelected 方法
const isSelected = (date: dayjs.Dayjs) => {
  return (
    tempSelectedDate.value?.isSame(date, 'day') ||
    (!tempSelectedDate.value && selectedDate.value?.isSame(date, 'day'))
  )
}

// 添加取消方法
const cancelSelect = () => {
  showPanel.value = false
  tempSelectedDate.value = null // 清空临时选中的日期
}
const selectedTime = ref('00:00')

// 添加 watch 来监听初始值
// 修改 watch
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      const date = dayjs(newValue as Date)
      const timeStr = date.format('HH:mm')
      selectedTime.value = timeStr
    }
  },
  { immediate: true }
)

const currentYear = computed(() => currentDate.value.year())
const currentMonth = computed(() => currentDate.value.month())

// 计算日历天数
const calendarDays = computed(() => {
  const firstDayOfMonth = currentDate.value.startOf('month')
  const lastDayOfMonth = currentDate.value.endOf('month')
  const days = []

  // 上个月的日期
  const firstDayWeekday = firstDayOfMonth.day()
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const date = firstDayOfMonth.subtract(i + 1, 'day')
    days.push({
      date: date,
      dayOfMonth: date.date(),
      otherMonth: true,
    })
  }

  // 当前月的日期
  for (let i = 0; i < lastDayOfMonth.date(); i++) {
    const date = currentDate.value.startOf('month').add(i, 'day')
    days.push({
      date: date,
      dayOfMonth: date.date(),
      otherMonth: false,
    })
  }

  // 下个月的日期
  const remainingDays = 42 - days.length
  for (let i = 0; i < remainingDays; i++) {
    const date = lastDayOfMonth.add(i + 1, 'day')
    days.push({
      date: date,
      dayOfMonth: date.date(),
      otherMonth: true,
    })
  }

  return days
})

// 方法
const togglePanel = () => {
  if (!showPanel.value) {
    showTimeSelect.value = false // 重置时间选择面板状态
  }
  showPanel.value = !showPanel.value
}

const changeYear = (delta: number) => {
  currentDate.value = currentDate.value.add(delta, 'year')
}

const changeMonth = (delta: number) => {
  currentDate.value = currentDate.value.add(delta, 'month')
}

const selectYear = (year: number) => {
  currentDate.value = dayjs(currentDate.value).set('year', year)
  if (selectedDate.value) {
    selectedDate.value = selectedDate.value.set('year', year)
  }
}

const selectMonth = (month: number) => {
  currentDate.value = dayjs(currentDate.value).set('month', month)
  if (selectedDate.value) {
    selectedDate.value = selectedDate.value.set('month', month)
  }
}

const handleTimeChange = (time: string) => {
  selectedTime.value = time
  if (selectedDate.value) {
    const [hours, minutes] = time.split(':')
    selectedDate.value = selectedDate.value
      .hour(parseInt(hours))
      .minute(parseInt(minutes))
  }
}

const isToday = (date: dayjs.Dayjs) => {
  return date.isSame(dayjs(), 'day')
}

const isDisabled = (date: dayjs.Dayjs) => {
  if (props.disabledDate) {
    return props.disabledDate(date.toDate())
  }
  // 默认禁用今天之前的日期（包括今天）
  return date.isBefore(dayjs().startOf('day'))
}

const formatDate = (date: dayjs.Dayjs | null) => {
  if (!date) return ''
  return date.format(props.format)
}

// 点击外部关闭面板
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.date-picker')) {
    showPanel.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 添加在其他 ref 变量附近
const showYearPanel = ref(false)
const showMonthPanel = ref(false)

// 添加处理方法
const handleYearPanelToggle = (show: boolean) => {
  showYearPanel.value = show
}

const handleMonthPanelToggle = (show: boolean) => {
  showMonthPanel.value = show
}

const showTimeSelect = ref(false)

const handleTimeSelectToggle = (show: boolean) => {
  showTimeSelect.value = show
}
</script>

<style scoped>
.date-picker {
  position: relative;
  width: fit-content;
}

.date-input {
  width: 100%;
  position: relative;
}

.date-input input {
  width: 100%;
  padding: 8px 30px 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background-color: #fff;
}

.calendar-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #606266;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.calendar-icon:hover {
  color: #409eff;
}

.date-panel {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  z-index: 1000;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 300px;
}

.panel-content {
  padding: 8px;
}

.calendar-body {
  padding: 8px 0;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  padding: 8px 0;
  border-bottom: 1px solid #e4e7ed;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  padding: 8px;
}

.day {
  text-align: center;
  padding: 6px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.day:hover:not(.selected) {
  background-color: #f5f7fa;
}

.selected {
  background-color: #409eff;
  color: white;
}

.selected:hover {
  background-color: #66b1ff;
}

.other-month {
  color: #c0c4cc;
}

.today {
  color: #409eff;
  font-weight: bold;
}

.today.selected {
  color: white;
}

.disabled {
  color: #c0c4cc;
  cursor: not-allowed;
  background-color: #f5f7fa;
}

.panel-footer {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
  border-top: 1px solid #e4e7ed;
}

.btn-confirm,
.btn-cancel {
  margin-left: 8px;
  padding: 5px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}

.btn-confirm {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.btn-confirm:hover {
  background-color: #66b1ff;
}

.btn-cancel:hover {
  background-color: #f5f7fa;
}
</style>
