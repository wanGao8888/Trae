<template>
  <div class="check-list">
    <div class="header">
      <h2>清场记录</h2>
      <el-button type="primary" @click="exportCheckList">导出记录</el-button>
    </div>

    <!-- 主表格部分 -->
    <table class="clearance-table">
      <tr>
        <td rowspan="2" class="date-cell" style="width: 40%">
          清场日期：<span>XXXX</span>年 <span>XX</span>月 <span>XX</span>日
        </td>
        <td class="info-cell" style="width: 14%">清场前批号：</td>
        <td class="info-cell" style="width: 16%">XXXX</td>
        <td class="info-cell" style="width: 14%">清场组员：</td>
        <td class="info-cell" style="width: 16%">XXXX</td>
      </tr>
      <tr>
        <td class="info-cell">清场后批号：</td>
        <td class="info-cell">XXXX</td>
        <td class="info-cell">清场时间段：</td>
        <td class="info-cell">XX:XX 至 XX:XX</td>
      </tr>
    </table>

    <!-- 清场类型行 -->
    <table class="clearance-table" style="margin-top: -1px">
      <tr>
        <td class="area-col">清场类型</td>
        <td style="text-align: center">换批清场□</td>
        <td style="text-align: center">试验批清场□</td>
        <td style="text-align: center">停产清场□</td>
      </tr>
    </table>

    <!-- 清场区域表格 -->
    <table class="clearance-table" style="margin-top: -1px">
      <thead>
        <tr>
          <th class="area-col">清场区域</th>
          <th class="content-col" style="text-align: center">
            清场内容
            <div class="sub-header">在清场的位置后划钩"√"</div>
          </th>
          <th class="status-col">是否清场</th>
          <th class="operator-col">清场人</th>
          <th class="date-col">日期</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in checkItems" :key="index">
          <td class="area-col">
            {{ item.category }}
            <div
              v-if="item.category === '注塑机' || item.category === '组装机'"
              class="batch-note"
            >
              本次的批号为 XX, XX, XX, XX
            </div>
          </td>
          <td class="content-col">
            <div class="check-items-wrapper">
              <template
                v-for="(subItem, subIndex) in item.items"
                :key="subIndex"
              >
                <span class="check-item">{{ subItem.name }}□</span>
              </template>
            </div>
          </td>
          <td class="status-col">
            <div class="status-item">YES □</div>
            <div class="status-item">N/A □</div>
          </td>
          <td class="operator-col">
            {{
              item.category !== '操作网' && item.category !== '外包柜'
                ? 'XXXX'
                : ''
            }}
          </td>
          <td class="date-col">
            {{
              item.category !== '操作网' && item.category !== '外包柜'
                ? 'XXXX'
                : ''
            }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 底部信息 -->
    <table class="clearance-table" style="margin-top: -1px">
      <tr>
        <td class="info-label" width="120px">检查结果</td>
        <td>XXXX</td>
      </tr>
    </table>

    <table class="clearance-table" style="margin-top: -1px">
      <tr>
        <td class="info-label" width="120px">其他</td>
        <td class="full-width-cell">是否清场中，已清场写"YES"，本次清场不涉及的写"N/A"</td>
      </tr>
    </table>

    <table class="clearance-table" style="margin-top: -1px">
      <tr>
        <td class="info-label" width="120px">备注</td>
        <td class="full-width-cell">是否清场中，已清场写"YES"，本次清场不涉及的写"N/A"</td>
      </tr>
    </table>

    <!-- 添加清场组组长/日期信息 -->
    <div class="footer-info">
      清场组组长/日期：XXX年XX月XX日至XX日 IP负责人/日期：XXX年XX月XX日至XX日
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  clearanceAreas: {
    batchChange: false,
    test: false,
    shutdown: false,
  },
})

// 为每个项目添加状态、操作人和日期字段
const checkItems = ref([
  {
    category: '外料料网',
    items: [
      { name: '标示' },
      { name: '示范书' },
      { name: '通道' },
      { name: '原料料口' },
      { name: '废料' },
    ],
  },
  {
    category: '内料料网',
    items: [
      { name: '设备' },
      { name: '原料区' },
      { name: '半成品区' },
      { name: '成品区' },
      { name: '空位料系统' },
    ],
  },
  {
    category: '注塑机',
    items: [
      { name: '台面' },
      { name: '机台成型' },
      { name: '料管接口' },
      { name: '回收/废料' },
      { name: '安全门闸' },
      { name: '模具' },
      { name: '漏料' },
      { name: '托盘' },
      { name: '机台车站' },
      { name: '自动分散' },
    ],
  },
  {
    category: '组装机',
    items: [
      { name: '取放及其传动区域' },
      { name: '外盒及其传动区域' },
      { name: '内盒及其传动区域' },
      { name: '传送带及底部' },
      { name: '原料输送' },
      { name: '制品输送' },
      { name: '控制柜' },
      { name: '两动直线' },
    ],
  },
  {
    category: '操作网',
    items: [
      { name: '工具' },
      { name: '刷料' },
      { name: '其它' },
      { name: '地板' },
      { name: '设备' },
      { name: '电净室及设备网' },
      { name: '工具' },
      { name: '检验' },
      { name: '标识' },
      { name: '通道' },
      { name: '记录' },
      { name: '合格' },
    ],
  },
  {
    category: '外包柜',
    items: [
      { name: '制造用木' },
      { name: '通道' },
      { name: '标识' },
      { name: '记录' },
      { name: '整改点' },
    ],
  },
])

const exportCheckList = () => {
  // 导出逻辑
}
</script>

<style scoped>
.check-list {
  padding: 20px;
  background: white;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* 表格相关样式 */
.clearance-table {
  width: 60%;
  margin: 0 auto;
  border-collapse: collapse;
}

/* 清场类型行样式 */
.clearance-table tr td[style*='text-align: center'] {
  width: calc((100% - 100px) / 3); /* 修改计算方式 */
}

/* 调整列宽度 */
.area-col {
  width: 100px;
  background-color: #fff;
  vertical-align: middle;
  box-sizing: border-box;
}

.content-col {
  width: calc(100% - 420px); /* 调整内容列宽度 */
}

.status-col {
  width: 80px;
}

.operator-col,
.date-col {
  width: 80px;
}

/* 日期单元格样式调整 */
.date-cell {
  width: 35%;
}

.info-cell {
  width: 15%;
}

.clearance-table th,
.clearance-table td {
  border: 1px solid #000;
  padding: 8px;
  text-align: left;
  vertical-align: middle !important;
  font-size: 14px;
  box-sizing: border-box;
}

/* 处理相邻表格的边框 */
.clearance-table + .clearance-table {
  margin-top: -1px;
}

/* 移除之前重复的边框样式定义 */
.clearance-table th,
.clearance-table td {
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  padding: 8px;
  text-align: left;
  vertical-align: middle !important;
  font-size: 14px;
  box-sizing: border-box;
}

/* 移除重复的边框 */
.clearance-table + .clearance-table {
  border-top: none;
}

.type-label {
  background-color: #fff;
  text-align: center;
  padding: 8px;
}

/* 移除不需要的样式 */
.type-row,
.type-cell {
  display: none;
}

/* 调整列宽度 */
.area-col {
  background-color: #fff; /* 移除灰色背景 */
  vertical-align: middle;
  box-sizing: border-box;
}

.content-col {
  min-width: 500px;
}

.status-col {
  width: 80px;
}

.operator-col,
.date-col {
  width: 80px;
}

/* 调整复选框样式 */
.check-items-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
}

.check-item {
  white-space: nowrap;
  padding: 2px 4px;
  display: inline-block;
}

/* 调整批号文本样式 */
.batch-note {
  font-size: 14px;
  color: #000;
  margin-top: 4px;
}

/* Element Plus 组件样式调整 */
:deep(.el-descriptions) {
  --el-descriptions-table-border: 1px solid #000;
}

:deep(.el-descriptions__label) {
  background-color: #fff; /* 移除灰色背景 */
  color: #000;
  padding: 8px;
  font-weight: normal;
  text-align: left;
}

:deep(.el-descriptions__content) {
  padding: 8px;
  color: #000;
}

/* 调整状态选项样式 */
.status-item {
  margin: 2px 0;
  text-align: left;
}

/* 调整表头样式 */
.sub-header {
  font-size: 14px;
  color: #000;
  margin-top: 2px;
}

/* 调整结果内容样式 */
.result-content {
  padding: 8px;
  min-height: 40px;
  color: #000;
  text-align: left;
}

.clearance-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: normal;
}

.content-col {
  min-width: 400px;
}

.status-col,
.operator-col,
.date-col {
  width: 100px;
}

/* 日期和时间相关 */
.date-row {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
}

.time-range {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 12px;
}

/* 检查项目相关 */
.check-items-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
}

.check-item {
  white-space: nowrap;
  padding: 2px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.check-items-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 8px;
}

/* 单元格样式 */
.area-cell {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.status-cell {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #666;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.operator-cell,
.date-cell {
  vertical-align: middle;
  text-align: left;
  height: 80px;
  padding: 12px;
  display: table-cell; /* 确保表格布局 */
}

.info-cell {
  vertical-align: middle !important; /* 强制垂直居中 */
  text-align: left;
  padding: 12px;
  height: 40px;
  display: table-cell; /* 确保表格布局 */
}

/* 覆盖默认的表格样式 */
.clearance-table td {
  vertical-align: middle !important; /* 强制所有单元格垂直居中 */
}

.date-cell span {
  display: inline-block;
  min-width: 30px;
  text-align: center;
}

/* 其他样式 */
.batch-note {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.sub-header {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.result-content {
  padding: 12px;
  min-height: 60px;
  color: #666;
}

.checkbox {
  margin-left: 4px;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-checkbox) {
  margin-right: 15px;
}

:deep(.el-descriptions) {
  --el-descriptions-table-border: 1px solid #ebeef5;
  width: 100%;
}

:deep(.el-descriptions__cell) {
  padding: 0 !important;
}

:deep(.el-descriptions__label) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: normal;
  padding: 12px 8px;
  min-width: 120px;
  text-align: center;
  justify-content: center;
  height: 100%;
}

:deep(.el-descriptions__content) {
  padding: 12px 8px;
  color: #666;
  min-height: 44px;
  display: flex;
  align-items: center;
}

:deep(.el-descriptions__body) {
  background-color: #fff;
}

:deep(.el-descriptions:not(:first-child)) {
  margin-top: -1px;
}

:deep(.el-descriptions__cell.is-bordered-content) {
  padding: 0 !important;
}

/* 右侧区域样式 */
.right-section {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.el-descriptions) {
    margin: 0;
  }

  :deep(.el-descriptions__cell) {
    height: 100%;
  }

  :deep(.el-descriptions__content) {
    height: 100%;
    padding: 8px;
  }
}

/* 区域标题样式 */
.area-header {
  display: flex;
  width: 100%;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.area-title {
  padding: 12px 8px;
  text-align: center;
  color: #606266;
  font-weight: normal;
  border-right: 1px solid #ebeef5;
}

.area-title:nth-child(1) {
  width: 120px;
}

.area-title:nth-child(2) {
  flex: 2;
}

.area-title:nth-child(3),
.area-title:nth-child(4),
.area-title:nth-child(5) {
  width: 100px;
}

.area-title:last-child {
  border-right: none;
}

:deep(.el-descriptions__title),
:deep(.el-descriptions__header) {
  margin: 0;
  padding: 0;
}
</style>
