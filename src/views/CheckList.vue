<template>
  <div class="check-list">
    <div class="header">
      <h2>清场记录</h2>
      <el-button type="primary" @click="exportCheckList">导出记录</el-button>
    </div>

    <!-- 主表格部分 -->
    <table class="clearance-table">
      <tbody>
        <tr>
          <td rowspan="2" class="date-cell">
            清场日期：<span>XXXX</span>年 <span>XX</span>月 <span>XX</span>日
          </td>
          <td class="info-cell info-cell-label">清场前批号：</td>
          <td class="info-cell info-cell-value">XXXX</td>
          <td class="info-cell info-cell-label">清场组员：</td>
          <td class="info-cell info-cell-value">XXXX</td>
        </tr>
        <tr>
          <td class="info-cell info-cell-label">清场后批号：</td>
          <td class="info-cell info-cell-value">XXXX</td>
          <td class="info-cell info-cell-label">清场时间段：</td>
          <td class="info-cell info-cell-value">XX:XX 至 XX:XX</td>
        </tr>
      </tbody>
    </table>

    <!-- 清场类型行 -->
    <table class="clearance-table" style="margin-top: -1px">
      <tbody>
        <tr>
          <td class="area-col">清场类型</td>
          <td class="type-option">换批清场□</td>
          <td class="type-option">试验批清场□</td>
          <td class="type-option">停产清场□</td>
        </tr>
      </tbody>
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
      <tbody style="box-sizing: border-box">
        <tr v-for="(item, index) in checkItems" :key="index">
          <td class="area-col">
            {{ item.category }}
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
              item.category !== '操作网' && item.category !== '外包间'
                ? 'XXXX'
                : ''
            }}
          </td>
          <td class="date-col">
            {{
              item.category !== '操作网' && item.category !== '外包间'
                ? 'XXXX'
                : ''
            }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 底部信息 -->
    <table class="clearance-table" style="margin-top: -1px">
      <tbody>
        <tr>
          <td class="info-label" width="80px">检查结果</td>
          <td>XXXX</td>
        </tr>
      </tbody>
    </table>

    <table class="clearance-table" style="margin-top: -1px">
      <tbody>
        <tr>
          <td colspan="2">
            其他：是否清场中，已清场写"YES"，本次清场不涉及的写"N/A"
          </td>
        </tr>
        <tr>
          <td colspan="2">
            备注：是否清场中，已清场写"YES"，本次清场不涉及的写"N/A"
          </td>
        </tr>
      </tbody>
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
    category: '外供料间',
    items: [
      { name: '标识' },
      { name: '指示书' },
      { name: '通知' },
      { name: '原辅料' },
      { name: '货位卡' },
    ],
  },
  {
    category: '内供料间',
    items: [
      { name: '设备' },
      { name: '混料机' },
      { name: '粉碎机' },
      { name: '烘干机' },
      { name: '真空供料系统' },
      { name: '容器' },
      { name: '储料斗' },
      { name: '工器具' },
      { name: '标识' },
      { name: '指示书' },
      { name: '通知' },
    ],
  },
  {
    category: '注塑机',
    items: [
      { name: '牵涉的机台号' },
      { name: '台面' },
      { name: '机台底部' },
      { name: '料管余料' },
      { name: '回收/废料袋' },
      { name: '安全门两侧' },
      { name: '模温机' },
      { name: '周转箱' },
      { name: '托油盘' },
      { name: '料把周转箱' },
      { name: '机台半成品' },
      { name: '自动分检机' },
    ],
  },
  {
    category: '组装机',
    items: [
      { name: '牵涉的机台号' },
      { name: '胶垫及其传动区域' },
      { name: '外盖及其传动区域' },
      { name: '内盖及其传动区域' },
      { name: '传送带及底部' },
      { name: '储料箱底部' },
      { name: '制品桶' },
      { name: '控制柜' },
      { name: '振动盘底部' },
      { name: '状态标识' },
      { name: '自动分拣机' },
    ],
  },
  {
    category: '操作间',
    items: [
      { name: '工器具类' },
      { name: '周转箱' },
      { name: '托盘' },
      { name: '货架' },
      { name: '地架' },
      { name: '设备' },
      { name: '超净台及底部顶部' },
      { name: '其他' },
      { name: '工具间' },
      { name: '检验间' },
      { name: '物流通道' },
      { name: '传递窗' },
      { name: '标识类' },
      { name: '指示书' },
      { name: '通知' },
      { name: '标签' },
      { name: '记录' },
      { name: '合格证' },
    ],
  },
  {
    category: '外包间',
    items: [
      { name: '制造指示书' },
      { name: '通知' },
      { name: '标识' },
      { name: '记录' },
      { name: '整袋成品' },
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
  width: 840px;
  margin: 0 auto;
  border-collapse: collapse;
  table-layout: fixed;
  box-sizing: border-box !important;
}

/* 调整列宽度 */
.clearance-table th.area-col,
.clearance-table td.area-col,
.area-col {
  width: 80px !important;
  background-color: #fff;
  vertical-align: middle;
  box-sizing: border-box !important;
}

.status-col,
.operator-col,
.date-col {
  /* width: 80px !important; */
  box-sizing: border-box !important;
}

.content-col {
  width: 480px !important;
  box-sizing: border-box !important;
}

/* 移除之前重复的边框样式定义 */
.clearance-table th,
.clearance-table td {
  border: 1px solid #000;
  padding: 8px;
  text-align: left;
  vertical-align: middle !important;
  font-size: 14px;
  box-sizing: border-box !important;
}

.type-option {
  box-sizing: border-box !important;
  text-align: center;
}

.type-option:nth-child(2) {
  width: 200px;
  text-align: center;
}

.type-option:nth-child(3),
.type-option:nth-child(4) {
  width: 280px;
  text-align: center;
}

/* 处理相邻表格的边框 */
.clearance-table + .clearance-table {
  margin-top: -1px;
}

/* 移除之前重复的边框样式定义 */
.clearance-table th,
.clearance-table td {
  border: 1px solid #000;
  padding: 8px;
  text-align: left;
  vertical-align: middle !important;
  font-size: 14px;
}

/* 移除重复的边框 */
.clearance-table + .clearance-table {
  border-top: none;
}

/* 调整批号文本样式 */
.batch-note {
  font-size: 14px;
  color: #000;
  margin-top: 4px;
}

/* 调整状态选项样式 */
.status-item {
  margin: 2px 0;
  text-align: left;
}

.clearance-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: normal;
}

.content-col {
  width: 480px;
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

.date-cell {
  width: 280px !important;
  box-sizing: border-box !important;
}

.info-cell {
  box-sizing: border-box !important;
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

/* 调整底部表格边框样式 */
.clearance-table:nth-last-of-type(-n + 2) {
  border-top: none;
}

.clearance-table:nth-last-of-type(-n + 2) td {
  border-top: none;
  border-bottom: 1px solid #000;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
}

.clearance-table:nth-last-of-type(-n + 2) .info-label {
  border-right: 1px solid #000;
}
</style>
