<template>
  <div
    class="custom-switch"
    :class="{ 'is-active': modelValue }"
    @click="toggleSwitch"
  >
    <div class="switch-handle"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const toggleSwitch = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
.custom-switch {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: #dcdfe6;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.custom-switch.is-active {
  background-color: #67c23a;
}

.switch-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.custom-switch.is-active .switch-handle {
  transform: translateX(20px);
}
</style>
