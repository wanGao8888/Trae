<template>
  <div class="photo-wall">
    <h1>照片墙</h1>

    <div class="controls">
      <el-button type="primary" @click="dialogVisible = true">
        <el-icon><Plus /></el-icon>添加照片
      </el-button>
    </div>

    <!-- 添加拖拽上传区域 -->
    <div
      class="drop-zone"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      :class="{ active: isDragging }"
    >
      <div class="drop-zone-content">
        <el-icon class="drop-icon"><Upload /></el-icon>
        <p>拖拽图片到此处上传</p>
      </div>
    </div>

    <div class="photo-grid">
      <!-- 照片列表 -->
    </div>
    <div class="photo-grid">
      <div
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="photo-item"
        :class="{
          'photo-large': photo.size === 'large',
          'photo-medium': photo.size === 'medium',
          'photo-small': photo.size === 'small',
        }"
      >
        <img :src="photo.url" :alt="photo.title" />
        <div class="photo-info">
          <h3>{{ photo.title }}</h3>
          <p>{{ photo.description }}</p>
          <div class="photo-actions">
            <el-button size="small" @click="handleEdit(photo)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(index)"
              >删除</el-button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑照片弹窗 -->
    <el-dialog
      :title="isEdit ? '编辑照片' : '添加照片'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        :model="photoForm"
        :rules="rules"
        ref="photoFormRef"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="photoForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            v-model="photoForm.description"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="图片URL" prop="url">
          <el-input v-model="photoForm.url" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="尺寸" prop="size">
          <el-select v-model="photoForm.size" placeholder="请选择尺寸">
            <el-option label="大" value="large" />
            <el-option label="中" value="medium" />
            <el-option label="小" value="small" />
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
import { ElMessage, ElMessageBox } from 'element-plus'

interface Photo {
  id: number
  title: string
  description: string
  url: string
  size: 'small' | 'medium' | 'large'
}

const dialogVisible = ref(false)
const isEdit = ref(false)
const editIndex = ref(-1)
const photoFormRef = ref<FormInstance>()

const photoForm = reactive({
  id: 0,
  title: '',
  description: '',
  url: '',
  size: 'medium' as 'small' | 'medium' | 'large',
})

const rules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  url: [{ required: true, message: '请输入图片URL', trigger: 'blur' }],
  size: [{ required: true, message: '请选择尺寸', trigger: 'change' }],
})

// 示例照片数据
const photos = ref<Photo[]>([
  {
    id: 1,
    title: '自然风景',
    description: '美丽的山水风景',
    url: 'https://picsum.photos/id/10/800/600',
    size: 'large',
  },
  {
    id: 2,
    title: '城市夜景',
    description: '繁华的城市夜景',
    url: 'https://picsum.photos/id/20/400/300',
    size: 'medium',
  },
  {
    id: 3,
    title: '花卉特写',
    description: '绽放的花朵',
    url: 'https://picsum.photos/id/30/300/300',
    size: 'small',
  },
  {
    id: 4,
    title: '海滩日落',
    description: '美丽的海滩日落',
    url: 'https://picsum.photos/id/40/800/500',
    size: 'large',
  },
  {
    id: 5,
    title: '动物世界',
    description: '可爱的小动物',
    url: 'https://picsum.photos/id/50/400/400',
    size: 'medium',
  },
])

// 添加拖拽相关状态
const isDragging = ref(false)

// 拖拽事件处理
const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false

  if (!e.dataTransfer?.files.length) return

  const files = Array.from(e.dataTransfer.files)

  // 过滤出图片文件
  const imageFiles = files.filter((file) => file.type.startsWith('image/'))

  if (imageFiles.length === 0) {
    ElMessage.warning('请拖入图片文件')
    return
  }

  // 处理拖入的图片
  imageFiles.forEach((file) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      if (event.target?.result) {
        // 创建新照片对象
        const newId = Math.max(...photos.value.map((p) => p.id), 0) + 1
        photos.value.push({
          id: newId,
          title: file.name.split('.')[0] || `照片${newId}`,
          description: '拖拽上传的照片',
          url: event.target.result as string,
          size: 'medium', // 默认中等尺寸
        })
      }
    }

    reader.readAsDataURL(file)
  })

  ElMessage.success(`成功添加 ${imageFiles.length} 张照片`)
}
const handleEdit = (photo: Photo) => {
  isEdit.value = true
  editIndex.value = photos.value.findIndex((p) => p.id === photo.id)
  Object.assign(photoForm, photo)
  dialogVisible.value = true
}

const handleDelete = (index: number) => {
  ElMessageBox.confirm(`确定要删除 ${photos.value[index].title} 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      photos.value.splice(index, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const submitForm = async () => {
  if (!photoFormRef.value) return

  await photoFormRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value && editIndex.value !== -1) {
        // 编辑照片
        photos.value[editIndex.value] = { ...photoForm }
        ElMessage.success('编辑成功')
      } else {
        // 添加照片
        const newId = Math.max(...photos.value.map((p) => p.id), 0) + 1
        photos.value.push({
          ...photoForm,
          id: newId,
        })
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
      resetForm()
    }
  })
}

const resetForm = () => {
  if (photoFormRef.value) {
    photoFormRef.value.resetFields()
  }
  photoForm.id = 0
  photoForm.title = ''
  photoForm.description = ''
  photoForm.url = ''
  photoForm.size = 'medium'
  isEdit.value = false
  editIndex.value = -1
}
</script>

<style scoped>
.photo-wall {
  padding: 20px;
  background: white;
  border-radius: 4px;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: minmax(200px, auto);
  grid-gap: 20px;
}

.photo-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.photo-item:hover {
  transform: translateY(-5px);
}

.photo-large {
  grid-column: span 2;
  grid-row: span 2;
}

.photo-medium {
  grid-column: span 1;
  grid-row: span 2;
}

.photo-small {
  grid-column: span 1;
  grid-row: span 1;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  transform: translateY(100%);
  transition: transform 0.3s;
}

.photo-item:hover .photo-info {
  transform: translateY(0);
}

.photo-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.photo-info p {
  margin: 0 0 10px 0;
  font-size: 14px;
}

.photo-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
/* 添加拖拽区域样式 */
.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
  transition: all 0.3s;
  cursor: pointer;
}

.drop-zone.active {
  border-color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.drop-icon {
  font-size: 48px;
  color: #909399;
  margin-bottom: 10px;
}

.drop-zone p {
  margin: 0;
  color: #606266;
  font-size: 16px;
}
</style>
