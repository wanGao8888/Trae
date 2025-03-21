<template>
  <div class="year-panel">
    <div class="year-grid">
      <div
        v-for="year in yearRange"
        :key="year"
        class="year-item"
        :class="{ selected: year === currentYear }"
        @click="$emit('select-year', year)"
      >
        {{ year }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentYear: number
}>()

const yearRange = computed(() => {
  const year = props.currentYear
  return Array.from({ length: 12 }, (_, i) => year - 5 + i)
})

defineEmits<{
  (e: 'select-year', year: number): void
}>()
</script>

<style scoped>
.year-panel {
  padding: 8px;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.year-item {
  text-align: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.year-item:hover {
  background-color: #f5f7fa;
}

.year-item.selected {
  background-color: #409eff;
  color: white;
}

.year-item.selected:hover {
  background-color: #66b1ff;
}
</style>