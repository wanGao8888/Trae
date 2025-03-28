<template>
  <div class="file-uploader">
    <!-- 文件上传区域 -->
    <div class="upload-area" @drop.prevent="handleDrop" @dragover.prevent>
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        :accept="accept"
        :multiple="multiple"
        class="file-input"
      />
      <div class="upload-content" @click="triggerFileInput">
        <svg class="upload-icon" viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
          />
        </svg>
        <p class="upload-text">点击或拖拽文件到此处上传</p>
        <p class="upload-hint">{{ hint }}</p>
      </div>
    </div>

    <!-- 文件列表 -->
    <div class="file-list" v-if="fileList.length">
      <div v-for="(file, index) in fileList" :key="index" class="file-item">
        <span class="file-name">{{ file.name }}</span>
        <div class="file-actions">
          <button class="action-btn" @click="downloadFile(file)">下载</button>
          <button class="action-btn delete" @click="removeFile(index)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  accept: {
    type: String,
    default: '*'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: '支持的文件格式：所有文件'
  }
})

const emit = defineEmits(['file-change'])

const fileInput = ref<HTMLInputElement | null>(null)
const fileList = ref<File[]>([])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const files = Array.from(input.files)
    if (props.multiple) {
      fileList.value.push(...files)
    } else {
      fileList.value = [files[0]]
    }
    emit('file-change', fileList.value)
  }
}

const handleDrop = (event: DragEvent) => {
  const files = Array.from(event.dataTransfer?.files || [])
  if (props.multiple) {
    fileList.value.push(...files)
  } else {
    fileList.value = [files[0]]
  }
  emit('file-change', fileList.value)
}

const removeFile = (index: number) => {
  fileList.value.splice(index, 1)
  emit('file-change', fileList.value)
}

const downloadFile = (file: File) => {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.file-uploader {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #409eff;
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  color: #909399;
  margin-bottom: 8px;
}

.upload-text {
  color: #606266;
  font-size: 14px;
  margin: 0;
}

.upload-hint {
  color: #909399;
  font-size: 12px;
  margin: 0;
}

.file-list {
  margin-top: 16px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.file-name {
  font-size: 14px;
  color: #606266;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  color: #606266;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.action-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.action-btn.delete {
  color: #f56c6c;
}

.action-btn.delete:hover {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
</style>