<template>
  <div class="tree-demo">
    <el-card class="tree-card">
      <template #header>
        <div class="card-header">
          <span>树形数据示例</span>
          <el-button type="primary" @click="getSelectedNodes">获取选中节点</el-button>
        </div>
      </template>
      
      <TreeView
        ref="treeViewRef"
        :data="treeData"
        node-key="id"
        :default-props="{ children: 'children', label: 'name' }"
        :show-checkbox="true"
        :default-expanded-keys="[1]"
        @node-click="handleNodeClick"
        @check="handleCheck"
      >
        <template #custom="{ data }">
          <span class="custom-tree-node">
            <span>{{ data.name }}</span>
            <span class="node-actions">
              <el-tag size="small" :type="data.type">{{ data.type }}</el-tag>
            </span>
          </span>
        </template>
      </TreeView>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import TreeView from '@/components/TreeView.vue'

const treeViewRef = ref()

// 模拟树形数据
const treeData = [
  {
    id: 1,
    name: '研发部',
    type: 'primary',
    children: [
      {
        id: 2,
        name: '前端组',
        type: 'success',
        children: [
          {
            id: 5,
            name: 'Vue项目组',
            type: 'info'
          },
          {
            id: 6,
            name: 'React项目组',
            type: 'info'
          }
        ]
      },
      {
        id: 3,
        name: '后端组',
        type: 'success',
        children: [
          {
            id: 7,
            name: 'Java项目组',
            type: 'info'
          },
          {
            id: 8,
            name: 'Python项目组',
            type: 'info'
          }
        ]
      },
      {
        id: 4,
        name: '测试组',
        type: 'warning'
      }
    ]
  }
]

// 节点点击事件
const handleNodeClick = (data: any, node: any) => {
  ElMessage.success(`点击了节点：${data.name}`)
}

// 节点选中事件
const handleCheck = (data: any, checked: any) => {
  console.log('选中节点：', data)
  console.log('选中状态：', checked)
}

// 获取选中节点
const getSelectedNodes = () => {
  const checkedNodes = treeViewRef.value?.getCheckedNodes()
  const nodeNames = checkedNodes?.map(node => node.name).join(', ')
  ElMessage.info(`选中的节点：${nodeNames || '无'}`)
}
</script>

<style scoped>
.tree-demo {
  padding: 20px;
}

.tree-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.node-actions {
  margin-left: 8px;
}
</style>