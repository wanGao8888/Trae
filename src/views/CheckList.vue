<template>
  <div class="check-list">
    <div class="header">
      <h2>清场记录</h2>
      <el-button type="primary" @click="exportCheckList">导出记录</el-button>
    </div>

    <!-- 主表格部分 -->
    <el-table :data="[formData]" border style="width: 100%">
      <el-table-column width="400">
        <template #default>
          <div class="date-row">
            <span class="date-label">清场日期：</span>
            <span>xx</span>年 <span>xx</span>月 <span>xx</span>日
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default>
          <div class="right-section">
            <table class="right-table">
              <tr>
                <td class="right-cell">
                  <table class="inner-table">
                    <tr>
                      <td class="label-cell">清场前批号</td>
                      <td class="input-cell">
                        <span>xx</span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td class="right-cell">
                  <table class="inner-table">
                    <tr>
                      <td class="label-cell">清场组员</td>
                      <td class="input-cell">
                        <span>xx</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="right-cell">
                  <table class="inner-table">
                    <tr>
                      <td class="label-cell">清场后批号</td>
                      <td class="input-cell">
                        <span>xx</span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td class="right-cell">
                  <table class="inner-table">
                    <tr>
                      <td class="label-cell">清场时间段</td>
                      <td class="input-cell">
                        <div class="time-range">
                          <span>xx</span>
                          至
                          <span>xx</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 清场类型行 -->
    <el-table :data="[formData]" border style="width: 100%; margin-top: -1px">
      <el-table-column width="150">
        <template #default>
          <div class="type-cell">清场类型</div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default>
          <div class="area-cell">
            <el-checkbox v-model="formData.clearanceAreas.batchChange">换批清场</el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default>
          <div class="area-cell">
            <el-checkbox v-model="formData.clearanceAreas.test">试验批清场</el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default>
          <div class="area-cell">
            <el-checkbox v-model="formData.clearanceAreas.shutdown">停产清场</el-checkbox>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 清场区域表格 -->
    <el-table :data="checkItems" border style="width: 100%; margin-top: -1px">
      <el-table-column label="清场区域" width="120" prop="category" />
      <el-table-column label="清场内容" min-width="400">
        <template #header>
          <div>
            清场内容
            <div class="sub-header">在清场的位置打钩"√"</div>
          </div>
        </template>
        <template #default="{ row }">
          <div class="check-items-grid">
            <div v-for="item in row.items" :key="item.name" class="check-item">
              {{ item.name }}
              <span class="checkbox">□</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否清场" width="100" align="center">
        <template #default>
          <div class="status-cell">
            <div>YES □</div>
            <div>N/A □</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="清场人" width="100">
        <template #default>
          <div class="operator-cell">XXXX</div>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="100">
        <template #default>
          <div class="date-cell">XXXX</div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部信息 -->
    <el-table :data="[formData]" border style="width: 100%; margin-top: -1px">
      <el-table-column width="120">
        <template #default>
          <div class="label-cell">检查结果</div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default>
          <div class="result-content">XXXX</div>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="[formData]" border style="width: 100%; margin-top: -1px">
      <el-table-column width="120">
        <template #default>
          <div class="label-cell">其他</div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default>
          <div class="result-content">XXXX</div>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="[formData]" border style="width: 100%; margin-top: -1px">
      <el-table-column width="120">
        <template #default>
          <div class="label-cell">备注</div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default>
          <div class="result-content">
            是否清场中，已清场写"YES"，本次清场不涉及的写"N/A"
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

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

.check-items-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 8px;
}

.check-item {
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
}

.area-cell {
  padding: 8px;
}

.status-cell {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #666;
}

.operator-cell,
.date-cell {
  padding: 8px;
  text-align: center;
  color: #666;
}

.checkbox {
  margin-left: 4px;
}

.right-section {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.right-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
}

.right-cell {
  padding: 0;
  border: 1px solid #ebeef5;
}

.inner-table {
  width: 100%;
  border-collapse: collapse;
}

.label-cell {
  width: 100px;
  padding: 8px;
  border-right: 1px solid #ebeef5;
  color: #606266;
  vertical-align: middle;
  background-color: #f5f7fa;
}

.input-cell {
  padding: 8px;
  vertical-align: middle;
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

:deep(.el-table) {
  margin-bottom: 1px;
}

:deep(.el-checkbox) {
  margin-right: 15px;
}

:deep(.el-table__row) {
  height: auto;
}

:deep(.el-table__cell) {
  padding: 0 !important;
  text-align: center !important;
}

:deep(.el-table__header .cell) {
  text-align: center;
  font-weight: normal;
}

:deep(.el-table__header-wrapper th) {
  color: #666 !important;
}

:deep(.el-table__body-wrapper td) {
  color: #666 !important;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  clearanceAreas: {
    batchChange: false,
    test: false,
    shutdown: false,
  }
})

const checkItems = ref([
  {
    category: '外料料网',
    items: [
      { name: '标示' },
      { name: '示范' },
      { name: '通道' },
      { name: '原料' },
      { name: '废料' },
    ]
  },
  {
    category: '内料料网',
    items: [
      { name: '设备' },
      { name: '原料区' },
      { name: '半成品区' },
      { name: '成品区' },
      { name: '空位料系统' },
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    category: '外包柜',
    items: [
      { name: '制造用木' },
      { name: '通道' },
      { name: '标识' },
      { name: '记录' },
      { name: '整改点' },
    ]
  }
])

const exportCheckList = () => {
  // 导出逻辑
}
</script>