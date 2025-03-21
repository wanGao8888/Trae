<template>
  <div class="time-picker">
    <div class="time-label">时间</div>
    <div class="time-input-wrapper" @click="toggleTimeSelect">
      <input
        type="text"
        :value="modelValue"
        readonly
        class="time-input"
        placeholder="请选择时间"
      />
      <span class="time-icon">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </span>
    </div>

    <Transition name="fade">
      <div v-if="showTimeSelect" class="time-select-panel">
        <div class="time-columns">
          <div class="time-column">
            <div class="time-column-label">时</div>
            <div class="time-column-content">
              <div
                v-for="hour in 24"
                :key="hour - 1"
                class="time-item"
                :class="{ active: selectedHour === hour - 1 }"
                @click="selectHour(hour - 1)"
              >
                {{ String(hour - 1).padStart(2, '0') }}
              </div>
            </div>
          </div>
          <div class="time-column">
            <div class="time-column-label">分</div>
            <div class="time-column-content">
              <div
                v-for="minute in 60"
                :key="minute - 1"
                class="time-item"
                :class="{ active: selectedMinute === minute - 1 }"
                @click="selectMinute(minute - 1)"
              >
                {{ String(minute - 1).padStart(2, '0') }}
              </div>
            </div>
          </div>
        </div>
        <div class="time-panel-footer">
          <button class="btn-confirm" @click="confirmTimeSelect">确定</button>
          <button class="btn-cancel" @click="cancelTimeSelect">取消</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'toggle-time-select', show: boolean): void
}>()

const showTimeSelect = ref(false)
const selectedHour = ref(0)
const selectedMinute = ref(0)

// 初始化时间值
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const [hours, minutes] = newValue.split(':')
    selectedHour.value = parseInt(hours)
    selectedMinute.value = parseInt(minutes)
    // 添加延时以确保 DOM 更新后再滚动
    setTimeout(() => {
      scrollToSelected()
    }, 0)
  }
}, { immediate: true })

// 修改滚动方法
const scrollToSelected = () => {
  const hourEl = document.querySelector('.time-column-content .time-item.active') as HTMLElement
  const minuteEl = document.querySelectorAll('.time-column-content .time-item.active')[1] as HTMLElement
  
  if (hourEl) {
    hourEl.parentElement?.scrollTo({
      top: hourEl.offsetTop - 80
    })
  }
  
  if (minuteEl) {
    minuteEl.parentElement?.scrollTo({
      top: minuteEl.offsetTop - 80
    })
  }
}

// 修改 toggleTimeSelect 方法
const toggleTimeSelect = () => {
  showTimeSelect.value = !showTimeSelect.value
  emit('toggle-time-select', showTimeSelect.value)
  if (showTimeSelect.value) {
    // 打开面板时滚动到选中位置
    setTimeout(() => {
      scrollToSelected()
    }, 0)
  }
}

const selectHour = (hour: number) => {
  selectedHour.value = hour
}

const selectMinute = (minute: number) => {
  selectedMinute.value = minute
}

const confirmTimeSelect = () => {
  const time = `${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`
  emit('update:modelValue', time)
  showTimeSelect.value = false
  emit('toggle-time-select', false)
}

const cancelTimeSelect = () => {
  if (props.modelValue) {
    const [hours, minutes] = props.modelValue.split(':')
    selectedHour.value = parseInt(hours)
    selectedMinute.value = parseInt(minutes)
  }
  showTimeSelect.value = false
  emit('toggle-time-select', false)
}
</script>

<style scoped>
.time-picker {
  padding: 12px;
  border-top: 1px solid #e4e7ed;
  position: relative; /* 添加相对定位 */
}

.time-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.time-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.time-input {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  background-color: #fff;
  transition: all 0.3s;
  cursor: pointer;
}

.time-input:hover {
  border-color: #409eff;
}

.time-icon {
  position: absolute;
  right: 8px;
  color: #909399;
}

.time-select-panel {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 200px;
}

.time-columns {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.time-column {
  flex: 1;
}

.time-column-content {
  height: 180px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.time-column {
  position: relative;
  width: 80px;
  flex: none;
  padding-bottom: 32px; /* 为底部按钮留出空间 */
}

.time-panel-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding-top: 8px;
  margin-top: 8px;
  border-top: 1px solid #e4e7ed;
  gap: 6px;
}

.time-column-content {
  height: 180px;
  overflow-y: auto;
}

/* 调整按钮大小 */
.btn-confirm,
.btn-cancel {
  padding: 3px 8px;
  min-width: 36px;
}

.time-column-content {
  height: 180px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.time-item {
  padding: 6px 0;
  text-align: center;
  cursor: pointer;
  color: #606266;
  transition: all 0.3s;
  font-size: 13px;
}

/* 添加过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.time-column {
  width: 80px; /* 设置固定宽度 */
  flex: none; /* 防止伸缩 */
}

.time-column-label {
  text-align: center;
  padding: 4px 0;
  color: #909399;
  font-size: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.time-column-content {
  height: 216px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.time-column-content::-webkit-scrollbar {
  width: 4px;
}

.time-column-content::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 2px;
}

.time-column-content::-webkit-scrollbar-track {
  background: #f5f7fa;
}

.time-item {
  padding: 8px 0;
  text-align: center;
  cursor: pointer;
  color: #606266;
  transition: all 0.3s;
  font-size: 14px;
}

.time-item:hover {
  color: #409eff;
  background-color: #ecf5ff;
}

.time-item.active {
  color: #409eff;
  font-weight: bold;
  background-color: #ecf5ff;
}

.time-panel-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  margin-top: 8px;
  border-top: 1px solid #e4e7ed;
  gap: 6px;
}

.btn-confirm,
.btn-cancel {
  padding: 4px 12px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
  border: 1px solid transparent;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
}

.btn-confirm {
  background-color: #409eff;
  color: white;
}

.btn-confirm:hover {
  background-color: #66b1ff;
}

.btn-confirm:active {
  background-color: #3a8ee6;
}

.btn-cancel {
  background-color: #fff;
  border-color: #dcdfe6;
  color: #606266;
}

.btn-cancel:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.btn-cancel:active {
  color: #3a8ee6;
  border-color: #3a8ee6;
}
</style>
