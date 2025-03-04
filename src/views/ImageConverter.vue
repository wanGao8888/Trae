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
        
        // 限制图片尺寸
        const maxSize = 800
        let width = img.width
        let height = img.height
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height)
          width = Math.floor(width * ratio)
          height = Math.floor(height * ratio)
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        // 创建SVG容器
        const container = document.createElement('div')
        const draw = SVG().addTo(container).size(width, height)
        
        // 添加背景矩形，避免透明区域显示为白色
        draw.rect(width, height).fill('#ffffff')
        
        const imageData = ctx.getImageData(0, 0, width, height)
        const data = imageData.data
        
        // 使用更高效的方法，并略微增加矩形尺寸以消除网格
        const pixelSize = Math.max(2, Math.floor(Math.min(width, height) / 200))
        const overlap = 0.5 // 重叠像素数，消除网格
        
        // 分块处理以避免堆栈溢出
        const processChunk = (startY: number, endY: number) => {
          for (let y = startY; y < endY && y < height; y += pixelSize) {
            for (let x = 0; x < width; x += pixelSize) {
              // 计算区域颜色平均值
              let r = 0, g = 0, b = 0, a = 0, count = 0
              
              for (let py = 0; py < pixelSize && y + py < height; py++) {
                for (let px = 0; px < pixelSize && x + px < width; px++) {
                  const i = ((y + py) * width + (x + px)) * 4
                  r += data[i]
                  g += data[i + 1]
                  b += data[i + 2]
                  a += data[i + 3]
                  count++
                }
              }
              
              if (count > 0) {
                r = Math.round(r / count)
                g = Math.round(g / count)
                b = Math.round(b / count)
                a = Math.round(a / count) / 255
                
                if (a > 0.1) { // 忽略几乎透明的像素
                  // 增加矩形尺寸，使其略微重叠，消除网格
                  draw.rect(pixelSize + overlap, pixelSize + overlap)
                    .move(x - overlap/2, y - overlap/2)
                    .fill(`rgba(${r},${g},${b},${a.toFixed(2)})`)
                    .stroke({ width: 0 })
                }
              }
            }
          }
        }
        
        // 分块处理图像
        const chunkSize = 50 // 每次处理50行
        let currentY = 0
        
        const processNextChunk = () => {
          const endY = Math.min(currentY + chunkSize * pixelSize, height)
          processChunk(currentY, endY)
          currentY = endY
          
          if (currentY < height) {
            // 使用setTimeout防止堆栈溢出
            setTimeout(processNextChunk, 0)
          } else {
            // 所有块处理完成，完成SVG
            // 优化SVG输出，移除不必要的属性
            let svgOutput = container.innerHTML
              .replace(/stroke="none"/g, '')
              .replace(/stroke-width="0"/g, '')
            
            svgContent.value = svgOutput
            resolve(true)
          }
        }
        
        // 开始处理
        processNextChunk()
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