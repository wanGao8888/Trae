<template>
  <div class="check-list">
    <div class="header">
      <h2>清场记录</h2>
      <el-button type="primary" @click="exportCheckList">导出记录</el-button>
    </div>

    <!-- 主表格部分 -->
    <el-descriptions :column="2" border>
      <el-descriptions-item :span="1" label="清场日期">
        <div class="date-row">
          <span>xx</span>年 <span>xx</span>月 <span>xx</span>日
        </div>
      </el-descriptions-item>
      <el-descriptions-item :span="1">
        <div class="right-section">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="清场前批号">xx</el-descriptions-item>
            <el-descriptions-item label="清场组员">xx</el-descriptions-item>
            <el-descriptions-item label="清场后批号">xx</el-descriptions-item>
            <el-descriptions-item label="清场时间段">
              <div class="time-range">
                <span>xx</span>
                至
                <span>xx</span>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <!-- 清场类型行 -->
    <el-descriptions :column="4" border style="margin-top: -1px">
      <el-descriptions-item label="清场类型">
        <div class="area-cell">
          <el-checkbox v-model="formData.clearanceAreas.batchChange"
            >换批清场</el-checkbox
          >
        </div>
      </el-descriptions-item>
      <el-descriptions-item>
        <div class="area-cell">
          <el-checkbox v-model="formData.clearanceAreas.test"
            >试验批清场</el-checkbox
          >
        </div>
      </el-descriptions-item>
      <el-descriptions-item>
        <div class="area-cell">
          <el-checkbox v-model="formData.clearanceAreas.shutdown"
            >停产清场</el-checkbox
          >
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <!-- 清场区域表格 -->
    <table class="clearance-table">
      <thead>
        <tr>
          <th class="area-col">清场区域</th>
          <th class="content-col">
            清场内容
            <div class="sub-header">在清场的位置打钩"√"</div>
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
              <div
                v-for="(subItem, subIndex) in item.items"
                :key="subIndex"
                class="check-item"
              >
                {{ subItem.name }} □
              </div>
            </div>
          </td>
          <td class="status-col">
            <div class="status-item">YES □</div>
            <div class="status-item">N/A □</div>
          </td>
          <td class="operator-col">XXXX</td>
          <td class="date-col">XXXX</td>
        </tr>
      </tbody>
    </table>

    <!-- 底部信息 -->
    <el-descriptions :column="1" border style="margin-top: -1px">
      <el-descriptions-item label="检查结果">
        <div class="result-content">XXXX</div>
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions :column="1" border style="margin-top: -1px">
      <el-descriptions-item label="其他">
        <div class="result-content">XXXX</div>
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions :column="1" border style="margin-top: -1px">
      <el-descriptions-item label="备注">
        <div class="result-content">
          是否清场中，已清场写"YES"，本次清场不涉及的写"N/A"
        </div>
      </el-descriptions-item>
    </el-descriptions>
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
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;
  margin-top: -1px;
}

.clearance-table th,
.clearance-table td {
  border: 1px solid #ebeef5;
  padding: 12px;
  text-align: center;
  vertical-align: middle;
}

.clearance-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: normal;
}

/* 列宽度设置 */
.area-col {
  width: 120px;
  background-color: #f5f7fa;
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
  padding: 8px;
  text-align: center;
  color: #666;
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
