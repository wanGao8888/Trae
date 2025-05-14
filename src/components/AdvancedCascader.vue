<template>
  <div class="advanced-cascader">
    <el-cascader
      v-model="selectedValue"
      :options="processedOptions"
      :props="elCascaderNodePropsConfig"
      @change="handleChange"
      clearable
      placeholder="请选择"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'

interface CascaderNode {
  value: string | number
  label: string
  children?: CascaderNode[]
}

interface Props {
  options: CascaderNode[]
  modelValue?: (string | number)[][]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: (string | number)[][]): void
}>()

const selectedValue = ref<(string | number)[][]>([])

// 处理选项，确保只能选择叶子节点
const processedOptions = computed(() => props.options)

// 级联选择器配置
const elCascaderNodePropsConfig = {
  checkStrictly: true,
  multiple: true,
  emitPath: true,
  expandTrigger: 'click',
}

// 处理选择变化
const handleChange = (currentRawValue: (string | number)[][]) => {
  // 只保留叶子节点
  const validSelections = currentRawValue.filter((path) => {
    const node = findNodeByPath(props.options, path)
    return node && (!node.children || node.children.length === 0)
  })

  // 按父节点去重，只保留每个父节点下最后一次选择的子节点，顺序与currentRawValue一致
  const parentMap = new Map<string | number, (string | number)[]>()
  validSelections.forEach((path) => {
    if (path.length > 0) {
      parentMap.set(path[0], path)
    }
  })
  // 保持currentRawValue顺序
  const finalSelections = []
  for (const path of validSelections) {
    if (parentMap.get(path[0]) === path) {
      finalSelections.push(path)
    }
  }

  selectedValue.value = finalSelections
  emit('update:modelValue', finalSelections)
}

// 根据路径查找节点
const findNodeByPath = (
  options: CascaderNode[],
  path: (string | number)[]
): CascaderNode | null => {
  let current = options
  let node: CascaderNode | null = null
  for (const value of path) {
    node = current.find((n) => n.value === value) || null
    if (!node) return null
    current = node.children || []
  }
  return node
}
</script>

<style scoped>
.advanced-cascader {
  width: 100%;
}
</style>
