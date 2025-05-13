<template>
  <div class="cascader-with-description">
    <el-form :model="form" label-width="80px">
      <el-form-item label="选择项">
        <el-cascader
          v-model="selectedValue"
          :options="options"
          :props="cascaderProps"
          @change="handleCascaderChange"
          placeholder="请选择"
          clearable
        />
      </el-form-item>
      <el-button
        type="primary"
        @click="drawerVisible = true"
        v-if="selectedValue.length > 0"
      >
        编辑描述
      </el-button>
    </el-form>

    <!-- 描述抽屉 -->
    <el-drawer v-model="drawerVisible" title="编辑描述" size="50%">
      <div class="drawer-content">
        <div
          v-for="(item, index) in selectedValue"
          :key="index"
          class="description-item"
        >
          <div class="selected-path">{{ getSelectedLabel(item) }}</div>
          <el-input
            v-model="descriptions[index]"
            type="textarea"
            :rows="3"
            :placeholder="`请输入描述`"
          />
        </div>
      </div>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
.drawer-content {
  padding: 20px;
}

.description-item {
  margin-bottom: 20px;
}

.selected-path {
  font-weight: bold;
  margin-bottom: 8px;
}

.drawer-footer {
  text-align: right;
  padding: 10px 20px;
}
</style>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

interface CascaderOption {
  value: string | number
  label: string
  children?: CascaderOption[]
}

interface SelectedItem {
  path: (string | number)[]
  description: string
}

interface CascaderValue {
  items: SelectedItem[]
}

const props = defineProps<{
  options: CascaderOption[]
  modelValue?: CascaderValue
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: CascaderValue): void
}>()

const selectedValue = ref<(string | number)[][]>([])
const descriptions = ref<string[]>([])
const drawerVisible = ref(false)

const cascaderProps = {
  multiple: true,
  emitPath: true,
}

// 获取选中项的完整标签
const getSelectedLabel = (path: (string | number)[]) => {
  let current = props.options
  const labels: string[] = []

  for (const value of path) {
    const option = current.find((opt) => opt.value === value)
    if (option) {
      labels.push(option.label)
      current = option.children || []
    }
  }

  return labels.join(' / ')
}

// 初始化值
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      selectedValue.value = newVal.items.map((item) => item.path)
      descriptions.value = newVal.items.map((item) => item.description)
    }
  },
  { immediate: true }
)

// 处理级联选择器变化
const handleCascaderChange = (value: (string | number)[][]) => {
  selectedValue.value = value
  console.log(value, 'value', descriptions.value)

  // 调整描述数组长度以匹配选择项
  descriptions.value = descriptions.value.slice(0, value.length)
  while (descriptions.value.length < value.length) {
    descriptions.value.push('')
  }
  emitUpdate()
}

// 添加确认按钮处理方法
const handleConfirm = () => {
  drawerVisible.value = false
  emitUpdate()
}

// 发送更新事件
const emitUpdate = () => {
  const items = selectedValue.value.map((path, index) => ({
    path,
    description: descriptions.value[index] || '',
  }))

  emit('update:modelValue', { items })
}
</script>

<style scoped>
.cascader-with-description {
  width: 100%;
}

.description-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
</style>
