<template>
  <div class="detail">
    <div class="page-header">
      <h2>详情管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>添加数据
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '正常' ? 'success' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="创建时间" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="() => handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="正常" value="正常" />
            <el-option label="异常" value="异常" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

interface TableRow {
  id: number
  name: string
  status: string
  date: string
}

const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('添加数据')
const formRef = ref<FormInstance>()

const formData = reactive({
  id: 0,
  name: '',
  status: '',
  date: ''
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
})

const tableData = ref<TableRow[]>([
  {
    id: 1,
    name: '测试数据1',
    status: '正常',
    date: '2024-01-01'
  },
  {
    id: 2,
    name: '测试数据2',
    status: '异常',
    date: '2024-01-02'
  }
])

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.id = 0
  formData.name = ''
  formData.status = ''
  formData.date = ''
}

const handleAdd = () => {
  dialogTitle.value = '添加数据'
  dialogVisible.value = true
}

const handleEdit = (row: TableRow) => {
  dialogTitle.value = '编辑数据'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      const now = new Date().toISOString().split('T')[0]
      console.log(now, 123);
      
      if (formData.id === 0) {
        // 添加数据
        const newId = Math.max(...tableData.value.map(item => item.id)) + 1
        tableData.value.push({
          id: newId,
          name: formData.name,
          status: formData.status,
          date: now
        })
        ElMessage.success('添加成功')
      } else {
        // 编辑数据
        const index = tableData.value.findIndex(item => item.id === formData.id)
        if (index !== -1) {
          tableData.value[index] = {
            ...tableData.value[index],
            name: formData.name,
            status: formData.status
          }
          ElMessage.success('修改成功')
        }
      }
      dialogVisible.value = false
      resetForm()
    }
  })
}

const handleDelete = (row: TableRow) => {
  ElMessageBox.confirm(
    `确定要删除 ${row.name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}
</script>

<style scoped>
.detail {
  background: white;
  padding: 20px;
  border-radius: 4px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>