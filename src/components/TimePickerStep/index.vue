<template>
  <el-time-picker
    v-model="internalValue"
    v-bind="$attrs"
    :disabled-minutes="disabledMinutes"
    :clearable="false"
    format="HH:mm"
    value-format="HH:mm:ss"
    popper-class="time-picker-step"
  />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  step: {
    type: Number,
    default: 30,
  },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

// 监听内部值变化
watch(internalValue, (val) => {
  emit('update:modelValue', val)
})

// 监听外部值变化
watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val
  }
)

// 禁用不在步长范围内的分钟选项
const disabledMinutes = () => {
  const minutes = []
  for (let i = 0; i < 60; i++) {
    if (i % props.step !== 0) {
      minutes.push(i)
    }
  }
  return minutes
}
</script>

<style lang="scss">
.time-picker-step {
  .el-time-spinner__wrapper {
    .el-time-spinner__item {
      &.is-disabled {
        height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        opacity: 0 !important;
        overflow: hidden !important;
      }
    }
    
    .el-time-spinner__item.is-active:not(.is-disabled) {
      color: #fff;
      background-color: var(--el-color-primary);
    }
  }

  .el-time-panel__content::after,
  .el-time-panel__content::before {
    content: none;
  }

  .el-time-spinner__list::after,
  .el-time-spinner__list::before {
    content: none !important;
  }
}
</style>
