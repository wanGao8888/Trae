<template>
  <div class="input-wrapper" :style="$attrs.style">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="input"
      @input="handleInput"
    />
    <Icon v-if="icon" :code="icon" class="icon" />
  </div>
</template>

<script setup>
import Icon from './Icon/Icon.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '请输入',
  },
  type: {
    type: String,
    default: 'text',
  },
  icon: {
    type: String,
    default: 'e6a8',
  },
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
.input-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 200px;
  height: 32px;
}

.input {
  width: 100%;
  height: 100%;
  padding: 4px 24px 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.input:focus {
  border-color: #409eff;
}

.icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  pointer-events: none;
}
</style>
