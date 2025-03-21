<template>
  <div class="panel-header">
    <div class="nav-buttons">
      <button class="nav-button" @click="changeYear(-1)" title="上一年">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M11 18l-6-6 6-6M18 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="nav-button" @click="changeMonth(-1)" title="上一月">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    
    <span class="year-month-selector">
      <span class="selector-item" @click="toggleYearPanel">{{ currentYear }}年</span>
      <span class="selector-item" @click="toggleMonthPanel">{{ currentMonth + 1 }}月</span>
    </span>
    
    <div class="nav-buttons">
      <button class="nav-button" @click="changeMonth(1)" title="下一月">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="nav-button" @click="changeYear(1)" title="下一年">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M13 18l6-6-6-6M6 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>

  <YearPanel
    v-if="showYearPanel"
    :current-year="currentYear"
    @select-year="selectYear"
  />
  <MonthPanel
    v-if="showMonthPanel"
    :current-month="currentMonth"
    @select-month="selectMonth"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import YearPanel from './YearPanel.vue'
import MonthPanel from './MonthPanel.vue'

const props = defineProps<{
  currentYear: number
  currentMonth: number
}>()

const emit = defineEmits<{
  (e: 'update-year', delta: number): void
  (e: 'update-month', delta: number): void
  (e: 'select-year', year: number): void
  (e: 'select-month', month: number): void
  (e: 'toggle-year-panel', show: boolean): void
  (e: 'toggle-month-panel', show: boolean): void
}>()

const showYearPanel = ref(false)
const showMonthPanel = ref(false)

const toggleYearPanel = () => {
  showYearPanel.value = !showYearPanel.value
  showMonthPanel.value = false
  emit('toggle-year-panel', showYearPanel.value)
  emit('toggle-month-panel', false)
}

const toggleMonthPanel = () => {
  showMonthPanel.value = !showMonthPanel.value
  showYearPanel.value = false
  emit('toggle-month-panel', showMonthPanel.value)
  emit('toggle-year-panel', false)
}

const changeYear = (delta: number) => {
  emit('update-year', delta)
}

const changeMonth = (delta: number) => {
  emit('update-month', delta)
}

const selectYear = (year: number) => {
  emit('select-year', year)
  showYearPanel.value = false
  emit('toggle-year-panel', false)
}

const selectMonth = (month: number) => {
  emit('select-month', month)
  showMonthPanel.value = false
  emit('toggle-month-panel', false)
}
</script>

<style scoped>
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #e4e7ed;
}

.nav-buttons {
  display: flex;
  gap: 4px;
}

.nav-button {
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  color: #606266;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.nav-button:hover {
  color: #409eff;
  background-color: #ecf5ff;
}

.year-month-selector {
  display: flex;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.selector-item {
  padding: 0 4px;
  cursor: pointer;
  color: #303133;
  transition: color 0.3s;
}

.selector-item:hover {
  color: #409eff;
}
</style>