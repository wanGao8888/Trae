<template>
  <div class="image-converter">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>图片转SVG</span>
        </div>
      </template>
      
      <el-upload
        class="upload-area"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :on-remove="handleRemove"
        accept=".jpg,.jpeg,.png"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 jpg/jpeg/png 格式图片
          </div>
        </template>
      </el-upload>

      <div class="preview-area" v-if="previewUrl && svgContent">
        <div class="original">
          <h3>原始图片</h3>
          <img :src="previewUrl" alt="原始图片">
        </div>
        <div class="converted">
          <h3>转换结果</h3>
          <div class="svg-container" v-html="svgContent"></div>
          <el-button type="primary" @click="downloadSvg" :disabled="!svgContent || loading">
            下载SVG
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { SVG } from '@svgdotjs/svg.js'

const previewUrl = ref('')
const svgContent = ref('')
const loading = ref(false)
const downloadSvg = () => {
  if (!svgContent.value) return
  
  const blob = new Blob([svgContent.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'converted.svg'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const handleFileChange = async (file: UploadFile) => {
  if (!file.raw) return
  
  loading.value = true
  previewUrl.value = URL.createObjectURL(file.raw)
  
  try {
    const img = new Image()
    img.src = previewUrl.value
    
    await new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        
        // 限制图片尺寸，避免处理过大的图片
        const maxSize = 800
        let width = img.width
        let height = img.height
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height)
          width *= ratio
          height *= ratio
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        const draw = SVG().size(width, height)
        const imageData = ctx.getImageData(0, 0, width, height)
        const data = imageData.data
        
        // 增加步长，减少处理量
        const step = Math.max(2, Math.floor(Math.min(width, height) / 200))
        
        // 创建背景
        draw.rect(width, height).fill('#fff')
        
        // 使用分块处理方式
        const chunkSize = 1000 // 每次处理的像素点数量
        const pixels = []
        
        // 收集需要处理的像素点
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const i = (y * width + x) * 4
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            const a = data[i + 3] / 255
            
            if (a > 0.1) {
              pixels.push({
                x,
                y,
                color: `rgb(${r},${g},${b})`
              })
            }
          }
        }
        
        // 分块处理像素点
        for (let i = 0; i < pixels.length; i += chunkSize) {
          const chunk = pixels.slice(i, i + chunkSize)
          chunk.forEach(pixel => {
            draw.rect(step, step)
              .move(pixel.x, pixel.y)
              .fill(pixel.color)
          })
        }
        
        svgContent.value = draw.svg()
        resolve(true)
      }
    })
  } catch (error) {
    ElMessage.error('转换失败：' + (error as Error).message)
  } finally {
    loading.value = false
  }
}
const handleRemove = () => {
  previewUrl.value = ''
  svgContent.value = ''
}
</script>
<style scoped>
.image-converter {
  padding: 20px;
}

.upload-area {
  width: 100%;
  margin: 20px 0;
}

.preview-area {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.original, .converted {
  flex: 1;
  text-align: center;
}

.original img, .svg-container {
  max-width: 100%;
  max-height: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
}

h3 {
  color: #606266;
  margin-bottom: 15px;
}
</style>