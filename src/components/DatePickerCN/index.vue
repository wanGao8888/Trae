<template>
  <el-config-provider :locale="zhCn">
    <el-date-picker
      v-model="internalValue"
      v-bind="$attrs"
      :value-format="valueFormat"
      :format="format"
      :placeholder="placeholder"
      @change="handleChange"
    />
  </el-config-provider>
</template>

<script setup>
import { ref, watch } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: ''
  },
  valueFormat: {
    type: String,
    default: 'YYYY-MM-DD'
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD'
  },
  placeholder: {
    type: String,
    default: '请选择日期'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const internalValue = ref(props.modelValue)

// 监听内部值变化
watch(internalValue, (val) => {
  emit('update:modelValue', val)
})

// 监听外部值变化
watch(() => props.modelValue, (val) => {
  internalValue.value = val
})

// 处理日期变化事件
const handleChange = (val) => {
  emit('change', val)
}
</script>

<style scoped>
.el-date-picker {
  width: 100%;
}
</style>