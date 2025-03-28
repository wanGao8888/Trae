<template>
  <div class="file-uploader-page">
    <div class="header">
      <h2>文件上传</h2>
      <el-button type="primary" @click="exportDeliveryNote"
        >导出送货单</el-button
      >
    </div>
    <FileUploader
      accept=".jpg,.png,.pdf"
      :multiple="true"
      hint="支持的文件格式：JPG、PNG、PDF"
      @file-change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import FileUploader from '@/components/FileUploader/FileUploader.vue'
import * as XLSX from 'xlsx-js-style'
import FileSaver from 'file-saver'

const handleFileChange = (files: File[]) => {
  console.log('选择的文件：', files)
}

const exportDeliveryNote = () => {
  // 创建工作簿
  const wb = XLSX.utils.book_new()

  // 准备数据
  const data = [
    ['苏州普诺英精密科技有限公司'],
    ['送货单'],
    [
      '客户：浙江良业集团有限公司',
      '',
      '',
      '',
      '发货日期：2023-7-13',
      '',
      '单据编码：********',
    ],
    [
      '项目号',
      '采购订单号',
      '物料编码',
      '产品名称',
      '规格型号',
      '单位',
      '数量',
      '备注',
    ],
    [
      'ZJ2302418',
      '10P0012307070714',
      '3070160073',
      '777双开连接片',
      't=0.25',
      'PCS',
      '3,000',
      '2000*1箱+1000*1箱',
    ],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['采购跟单：', '', '制单人：', '', '发货人：', '', '收货人：', ''],
  ]

  // 创建工作表
  const ws = XLSX.utils.aoa_to_sheet(data)

  // 设置列宽和行高
  ws['!cols'] = [
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 8 },
    { wch: 10 },
    { wch: 20 },
  ]
  ws['!rows'] = Array(15).fill({ hpt: 25 })

  // 修改边框样式定义
  const borderAll = {
    style: 'thin',
    color: { rgb: '000000' },
  }

  const borderStyle = {
    top: borderAll,
    bottom: borderAll,
    left: borderAll,
    right: borderAll,
  }

  // 设置基础样式
  const baseStyle = {
    font: {
      name: '宋体',
      sz: 10,
      color: { rgb: '000000' },
    },
    alignment: {
      vertical: 'center',
      horizontal: 'center',
      wrapText: true,
    },
    border: borderStyle,
    fill: {
      fgColor: { rgb: 'FFFFFF' },
      type: 'pattern',
      patternType: 'solid',
    },
  }

  // 先处理第一行样式
  const titleStyle = {
    font: {
      name: '宋体',
      bold: true,
      sz: 16,
      color: { rgb: '000000' },
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center',
      wrapText: true,
    },
    fill: {
      fgColor: { rgb: 'FFFFFF' },
      type: 'pattern',
      patternType: 'solid',
    },
  }

  // 为所有单元格设置基础样式
  for (let row = 1; row < data.length; row++) {
    for (let col = 0; col < 8; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col })
      ws[cellRef] = ws[cellRef] || { v: '', t: 's' }
      ws[cellRef].s = { ...baseStyle }
    }
  }

  // 为第一行设置样式
  const firstRow = XLSX.utils.encode_cell({ r: 0, c: 0 })
  ws[firstRow].s = titleStyle

  // 设置合并单元格
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // 公司名
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // 送货单
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, // 客户
    { s: { r: 2, c: 4 }, e: { r: 2, c: 5 } }, // 发货日期
    { s: { r: 2, c: 6 }, e: { r: 2, c: 7 } }, // 单据编码
  ]

  // 特殊行样式调整
  const specialRows = {
    2: 'left', // 客户信息行
    8: 'left', // 签名行
  }

  // 应用特殊行样式
  Object.entries(specialRows).forEach(([row, align]) => {
    for (let col = 0; col < 8; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: parseInt(row), c: col })
      if (ws[cellRef].v) {
        ws[cellRef].s = {
          ...baseStyle,
          alignment: {
            ...baseStyle.alignment,
            horizontal: align as 'left' | 'center',
          },
        }
      }
    }
  })

  // 修改送货单标题样式（第二行）
  const secondRowStyle = {
    font: {
      name: '宋体',
      bold: true,
      sz: 14,
      color: { rgb: '000000' },
    },
    alignment: {
      vertical: 'center',
      horizontal: 'center',
      wrapText: true,
    },
    border: borderStyle,
    fill: {
      fgColor: { rgb: 'FFFFFF' },
      type: 'pattern',
      patternType: 'solid',
    },
  }

  // 确保第二行的单元格存在并设置样式
  for (let col = 0; col < 8; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 1, c: col })
    if (!ws[cellRef]) {
      ws[cellRef] = { v: '', t: 's' }
    }
    ws[cellRef].s = { ...secondRowStyle }
  }

  // 客户信息行样式调整
  const customerRow = 2
  for (let col = 0; col < data[customerRow].length; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: customerRow, c: col })
    ws[cellRef] = ws[cellRef] || { v: '', t: 's' }
    ws[cellRef].s = {
      ...baseStyle,
      alignment: {
        ...baseStyle.alignment,
        horizontal: ws[cellRef].v ? 'left' : 'center',
      },
    }
  }

  // 表头样式（第4行）
  for (let col = 0; col < data[3].length; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 3, c: col })
    ws[cellRef].s = {
      ...baseStyle,
      font: {
        ...baseStyle.font,
        bold: true,
        sz: 11,
      },
      fill: {
        fgColor: { rgb: 'F2F2F2' },
      },
    }
  }

  // 底部签名行样式调整
  const signatureRow = data.length - 1
  for (let col = 0; col < data[signatureRow].length; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: signatureRow, c: col })
    ws[cellRef] = ws[cellRef] || { v: '', t: 's' }
    ws[cellRef].s = {
      ...baseStyle,
      alignment: {
        ...baseStyle.alignment,
        horizontal: ws[cellRef].v ? 'left' : 'center',
      },
    }
  }

  // 空行样式（保持边框）
  for (let row = 5; row < signatureRow; row++) {
    for (let col = 0; col < data[row].length; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col })
      ws[cellRef] = ws[cellRef] || { v: '', t: 's' }
      ws[cellRef].s = { ...baseStyle }
    }
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, '送货单')

  // 导出文件
  const wopts = {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true,
  }

  const wbout = XLSX.write(wb, wopts)
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  FileSaver.saveAs(blob, `送货单_${new Date().toLocaleDateString()}.xlsx`)
}
</script>

<style scoped>
.file-uploader-page {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  color: #303133;
}
</style>
