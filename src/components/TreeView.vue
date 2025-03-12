<template>
  <div class="tree-view">
    <el-tree
      ref="treeRef"
      :data="data"
      :props="defaultProps"
      :node-key="nodeKey"
      :default-expanded-keys="defaultExpandedKeys"
      :show-checkbox="showCheckbox"
      :default-checked-keys="defaultCheckedKeys"
      :highlight-current="true"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      @check="handleCheck"
    >
      <template #default="{ node, data }">
        <slot name="custom" :node="node" :data="data">
          <span class="custom-tree-node">
            <span>{{ data[defaultProps.label] }}</span>
          </span>
        </slot>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TreeNode {
  [key: string]: any
}

const props = defineProps({
  data: {
    type: Array as () => TreeNode[],
    required: true,
  },
  nodeKey: {
    type: String,
    default: 'id'
  },
  defaultProps: {
    type: Object,
    default: () => ({
      children: 'children',
      label: 'label'
    })
  },
  defaultExpandedKeys: {
    type: Array as () => (string | number)[],
    default: () => []
  },
  showCheckbox: {
    type: Boolean,
    default: false
  },
  defaultCheckedKeys: {
    type: Array as () => (string | number)[],
    default: () => []
  }
})

const emit = defineEmits<{
  (e: 'node-click', data: TreeNode, node: any): void
  (e: 'check', checkedNodes: TreeNode[], checkedKeys: any): void
}>()

const treeRef = ref()

const handleNodeClick = (data: TreeNode, node: any) => {
  emit('node-click', data, node)
}

const handleCheck = (data: TreeNode, checked: any) => {
  emit('check', data, checked)
}

// 暴露方法给父组件
defineExpose({
  getCheckedNodes: () => treeRef.value?.getCheckedNodes(),
  getCheckedKeys: () => treeRef.value?.getCheckedKeys(),
  setCheckedKeys: (keys: (string | number)[]) => treeRef.value?.setCheckedKeys(keys),
  setChecked: (key: string | number, checked: boolean) => treeRef.value?.setChecked(key, checked)
})
</script>

<style scoped>
.tree-view {
  width: 100%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>