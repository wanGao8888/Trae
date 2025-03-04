<template>
  <div class="photo-wall">
    <h1>照片墙</h1>

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

    <!-- 瀑布流布局 -->
    <div class="waterfall" ref="waterfallRef">
      <div
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="waterfall-item"
        :style="{ height: `${photo.height}px` }"
      >
        <el-image
          :src="photo.url"
          :alt="photo.title"
          fit="cover"
          lazy
          @load="onImageLoad(index)"
        />
        <div class="photo-info">
          <h3>{{ photo.title }}</h3>
          <p>{{ photo.description }}</p>
        </div>
      </div>
    </div>

    <!-- 加载更多指示器 -->
    <div v-if="loading" class="loading-more">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <!-- 无更多数据提示 -->
    <div v-if="noMore && !loading" class="no-more">
      <span>没有更多照片了</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Upload, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Photo {
  id: number
  title: string
  description: string
  url: string
  height: number
  loaded: boolean
}

const photos = ref<Photo[]>([])
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const noMore = ref(false)
const isDragging = ref(false)
const waterfallRef = ref<HTMLElement | null>(null)

// 获取照片数据
const fetchPhotos = async () => {
  if (loading.value || noMore.value) return

  loading.value = true

  try {
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newPhotos = Array.from({ length: pageSize.value }, (_, i) => {
      const id = photos.value.length + i + 1
      const randomHeight = Math.floor(Math.random() * 200) + 200 // 200-400px

      return {
        id,
        title: `照片 ${id}`,
        description: `这是第 ${id} 张照片的描述`,
        url: `https://picsum.photos/400/${randomHeight}?random=${id}`,
        height: randomHeight,
        loaded: false,
      }
    })

    // 如果已经加载了50张照片，模拟没有更多数据
    if (photos.value.length + newPhotos.length >= 50) {
      noMore.value = true
    }

    photos.value.push(...newPhotos)
    page.value++
  } catch (error) {
    ElMessage.error('获取照片失败')
  } finally {
    loading.value = false
  }
}

// 图片加载完成后触发
const onImageLoad = (index: number) => {
  photos.value[index].loaded = true
}

// 检查是否需要加载更多
const checkScrollPosition = () => {
  if (!waterfallRef.value) return

  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  // 当滚动到距离底部100px时加载更多
  if (
    scrollTop + windowHeight >= documentHeight - 100 &&
    !loading.value &&
    !noMore.value
  ) {
    fetchPhotos()
  }
}

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
        const newId = Math.max(...photos.value.map((p) => p.id), 0) + 1
        const randomHeight = Math.floor(Math.random() * 200) + 200

        photos.value.unshift({
          id: newId,
          title: file.name.split('.')[0] || `照片${newId}`,
          description: '拖拽上传的照片',
          url: event.target.result as string,
          height: randomHeight,
          loaded: false,
        })
      }
    }

    reader.readAsDataURL(file)
  })

  ElMessage.success(`成功添加 ${imageFiles.length} 张照片`)
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', checkScrollPosition, true)
  fetchPhotos()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollPosition, true)
})
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
  text-align: center;
}

/* 拖拽区域样式 */
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

/* 瀑布流布局 */
.waterfall {
  column-count: 1;
  column-gap: 15px;
}

@media (min-width: 576px) {
  .waterfall {
    column-count: 2;
  }
}

@media (min-width: 768px) {
  .waterfall {
    column-count: 3;
  }
}

@media (min-width: 992px) {
  .waterfall {
    column-count: 4;
  }
}

@media (min-width: 1200px) {
  .waterfall {
    column-count: 5;
  }
}

.waterfall-item {
  break-inside: avoid;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  position: relative;
}

.waterfall-item:hover {
  transform: translateY(-5px);
}

.waterfall-item img {
  width: 100%;
  display: block;
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

.waterfall-item:hover .photo-info {
  transform: translateY(0);
}

.photo-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.photo-info p {
  margin: 0;
  font-size: 14px;
}

/* 加载更多和无更多数据样式 */
.loading-more,
.no-more {
  text-align: center;
  padding: 20px 0;
  color: #909399;
}

.loading-icon {
  animation: rotating 2s linear infinite;
  margin-right: 5px;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
