<template>
  <div class="house-detail">
    <h1>房屋详情</h1>
    <TableComponent
      :headers="tableHeaders"
      :rows="formattedHouseData"
      :footer="footerText"
      headerAlign="center"
      bodyAlign="center"
    >
      <!-- 为每个操作单元格提供自定义内容 -->
      <template
        v-for="(house, index) in houses"
        :key="house.id"
        #[`cell-${index}-4`]
      >
        <button class="edit-btn" @click="editHouse(house.id)">编辑</button>
        <button class="delete-btn" @click="deleteHouse(house.id)">删除</button>
      </template>
    </TableComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TableComponent from '../components/TableComponent.vue'

// 使用更结构化的数据
const houses = ref([
  { id: 1, name: '房屋A', address: '地址A', price: '100万', operator: '张三' },
  { id: 2, name: '房屋B', address: '地址B', price: '200万', operator: '李四' },
  { id: 3, name: '房屋C', address: '地址C', price: '300万', operator: '王五' },
])

// 添加操作人列
const tableHeaders = ['房屋名称', '地址', '价格', '操作人', '操作']

// 使用计算属性格式化表格数据，不再包含HTML字符串
const formattedHouseData = computed(() => {
  return houses.value.map((house) => [
    house.name,
    house.address,
    house.price,
    house.operator, // 添加操作人列
    '', // 操作列使用插槽渲染
  ])
})

// 动态计算页脚文本
const footerText = computed(() => `总计: ${houses.value.length} 条记录`)

// 编辑房屋
const editHouse = (id: number) => {
  alert(`编辑房屋ID: ${id}，功能待实现`)
}

// 删除房屋
const deleteHouse = (id: number) => {
  if (confirm(`确定要删除ID为 ${id} 的房屋吗？`)) {
    houses.value = houses.value.filter((house) => house.id !== id)
  }
}
</script>

<style scoped>
.house-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  border-radius: 3px;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 3px;
}

.edit-btn:hover {
  background-color: #45a049;
}

.delete-btn:hover {
  background-color: #d32f2f;
}
</style>
