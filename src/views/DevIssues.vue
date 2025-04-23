<template>
  <div class="dev-issues">
    <div class="page-header">
      <h1 class="page-title">开发问题记录</h1>
      <el-button type="primary" @click="openAddDialog" class="add-button">
        <el-icon><Plus /></el-icon>
        添加问题
      </el-button>
    </div>

    <el-table :data="issues" style="width: 100%" stripe border>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column prop="type" label="类型" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="getTagType(row.type)">
            {{ typeLabels[row.type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述" min-width="200" />
      <el-table-column prop="solution" label="解决方案" min-width="200" />
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="图片" width="150">
        <template #default="{ row }">
          <el-image
            v-for="(img, i) in row.images"
            :key="i"
            :src="img.url"
            :preview-src-list="row.images.map((i) => i.url)"
            class="thumbnail"
            hide-on-click-modal
            :initial-index="i"
            :zoom-rate="1.2"
            :max-scale="1"
            :min-scale="0.2"
            fit="cover"
            loading="lazy"
            :preview-teleported="true"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row, $index }">
          <div class="action-buttons">
            <el-button type="primary" size="small" @click="handleEdit($index)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="handleDelete($index)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <el-dialog v-model="showDialog" title="添加问题" width="50%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="问题标题" required>
          <el-input v-model="form.title" placeholder="请输入问题标题" />
        </el-form-item>
        <el-form-item label="问题类型" required>
          <el-select v-model="form.type" placeholder="请选择问题类型">
            <el-option
              v-for="(label, value) in typeLabels"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" required>
          <el-input v-model="form.desc" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="解决方案">
          <el-input
            v-model="form.solution"
            type="textarea"
            :rows="4"
            placeholder="请输入解决方案"
          />
        </el-form-item>
        <el-form-item label="错误图片">
          <el-upload
            drag
            multiple
            :auto-upload="false"
            :on-change="handleUpload"
            :on-remove="handleRemove"
            list-type="picture-card"
            :file-list="form.images"
          >
            <el-icon><upload-filled /></el-icon>
            <div>拖拽上传或<em>点击选择</em></div>
          </el-upload>
          <!-- <div class="upload-preview-container">
            <img
              v-for="(file, index) in form.images"
              :key="index"
              :src="file.url"
              class="upload-preview-image"
            />
          </div> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { UploadFilled, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadUserFile } from 'element-plus'
import { addIssuesToDB } from '../apis/useIssuesAdd'
import { fetchIssuesFromDB } from '../apis/useIssuesFetch'
import { deleteIssuesFromDB } from '../apis/useIssuesDelete'
import { updateIssuesToDB } from '../apis/useIssuesUpdate'

type Issue = {
  _id: string
  title: string
  type: string
  desc: string
  solution: string // 新增解决方案字段
  images: UploadUserFile[] // 修改为UploadUserFile数组类型
  createdAt: string
}

const typeLabels = {
  bug: 'Bug',
  style: '样式问题',
  performance: '性能问题',
  feature: '功能需求',
  other: '其他',
}

const form = reactive<Omit<Issue, '_id' | 'createdAt'>>({
  title: '',
  type: '',
  desc: '',
  solution: '', // 新增解决方案字段
  images: [],
})

const issues = ref<Issue[]>([])
const showDialog = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

const getTagType = (
  type: string
): 'danger' | 'warning' | 'info' | 'success' | 'primary' => {
  const types: Record<
    string,
    'danger' | 'warning' | 'info' | 'success' | 'primary'
  > = {
    bug: 'danger',
    style: 'warning',
    performance: 'info',
    feature: 'success',
    other: 'primary', // 将空字符串改为'primary'
  }
  return types[type] || 'primary' // 默认返回'primary'而不是空字符串
}

const handleUpload = (uploadFile: UploadFile) => {
  if (!uploadFile.raw || !uploadFile.raw.type.match('image.*')) {
    ElMessage.warning('请上传图片文件')
    return false
  }

  return new Promise<void>((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        form.images.push({
          name: uploadFile.name,
          url: e.target.result as string,
        })
      }
      resolve()
    }
    reader.readAsDataURL(uploadFile.raw)
  })
}

const currentEditIndex = ref<number | null>(null)

const handleEdit = (index: number) => {
  const issue = issues.value[index]
  if (!issue) {
    ElMessage.error('未找到要编辑的记录')
    return
  }

  currentEditIndex.value = index
  form.title = issue.title
  form.type = issue.type
  form.desc = issue.desc
  form.solution = issue.solution
  // 确保图片数据的正确复制
  form.images = Array.isArray(issue.images) ? [...issue.images] : []
  showDialog.value = true
}

const handleAdd = async () => {
  if (!form.title.trim()) {
    ElMessage.error('请输入问题标题')
    return
  }
  if (!form.type) {
    ElMessage.error('请选择问题类型')
    return
  }
  if (!form.desc.trim()) {
    ElMessage.error('请输入问题描述')
    return
  }

  try {
    if (currentEditIndex.value !== null) {
      // 编辑模式
      const index = currentEditIndex.value
      const updatedData = {
        title: form.title,
        type: form.type,
        desc: form.desc,
        solution: form.solution,
        images: [...form.images],
        createdAt: issues.value[index].createdAt,
      }

      // 正确：传递 id 和更新数据
      await updateIssuesToDB(issues.value[index]._id, updatedData)

      // 更新本地数据
      issues.value[index] = {
        ...issues.value[index],
        ...updatedData,
      }

      ElMessage.success('问题更新成功')
    } else {
      // 添加模式
      const newIssue = {
        title: form.title,
        type: form.type,
        desc: form.desc,
        solution: form.solution,
        images: [...form.images],
        createdAt: new Date().toISOString(),
      }

      // 添加模式应该使用 addIssuesToDB
      const response = await addIssuesToDB(newIssue)
      if (response && response.code === 200) {
        ElMessage.success(response.message)
      }
    }

    // 在 handleAdd 函数成功后
    showDialog.value = false
    resetForm()
    currentEditIndex.value = null
    // 重新获取当前页数据
    fetchList()
  } catch (error) {
    ElMessage.error('操作失败，请重试')
    console.error('更新失败:', error)
  }
}
const handleDelete = (index: number) => {
  const issue = issues.value[index]
  if (!issue) {
    ElMessage.error('未找到要删除的记录')
    return
  }

  deleteIssuesFromDB(issue._id)
    .then(() => {
      ElMessage.success('删除成功')
      fetchList()
    })
    .catch((error) => {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    })
}

const resetForm = () => {
  form.title = ''
  form.type = ''
  form.desc = ''
  form.solution = ''
  form.images = []
}

const openAddDialog = () => {
  resetForm() // 重置表单
  currentEditIndex.value = null // 确保不在编辑模式
  showDialog.value = true // 打开对话框
}

// 修改获取列表的函数
const fetchList = async () => {
  try {
    const data = await fetchIssuesFromDB(currentPage.value, pageSize.value)
    if (data) {
      issues.value = data.list
      total.value = data.total
    }
  } catch (error) {
    ElMessage.error('获取列表失败')
    console.error('获取列表失败:', error)
  }
}

// 添加页码改变的处理函数
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchList()
}

// 添加每页条数改变的处理函数
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchList()
}

onMounted(() => {
  fetchList()
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const handleRemove = (file: UploadFile) => {
  form.images = form.images.filter((img) => img.name !== file.name)
}
</script>

<style scoped>
.dev-issues {
  padding: 32px;
  max-width: 100%;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow-x: hidden; /* 防止出现水平滚动条 */
}
.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.page-title {
  font-size: 24px;
  color: #303133;
  margin: 0;
  font-weight: 600;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
}

.thumbnail {
  width: 70px;
  height: 70px;
  object-fit: cover;
  margin: 0 8px 8px 0;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.thumbnail:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.el-table {
  margin-top: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  width: 100%; /* 确保表格宽度适应容器 */
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #303133;
  font-weight: 600;
  padding: 16px 0;
}

:deep(.el-table td) {
  padding: 16px 0;
}

:deep(.el-tag) {
  padding: 6px 12px;
  font-weight: 500;
}
.upload-preview-container {
  margin-left: 20px;
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  gap: 10px; /* 图片之间的间距 */
}

.upload-preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
