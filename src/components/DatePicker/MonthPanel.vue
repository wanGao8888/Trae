<template>
  <div class="month-panel">
    <div class="month-grid">
      <div
        v-for="(month, index) in monthNames"
        :key="index"
        class="month-item"
        :class="{ selected: index === currentMonth }"
        @click="$emit('select-month', index)"
      >
        {{ month }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentMonth: number
}>()

const monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
]

defineEmits<{
  (e: 'select-month', month: number): void
}>()
</script>

<style scoped>
.month-panel {
  padding: 8px;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.month-item {
  text-align: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.month-item:hover {
  background-color: #f5f7fa;
}

.month-item.selected {
  background-color: #409eff;
  color: white;
}

.month-item.selected:hover {
  background-color: #66b1ff;
}
</style>