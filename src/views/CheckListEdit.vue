<template>
  <div class="check-list">
    <div class="header">
      <h2>清场记录编辑</h2>
    </div>

    <!-- 主表格部分 -->
    <el-form :model="formData" label-width="120px">
      <table class="clearance-table">
        <tbody>
          <tr>
            <td rowspan="2" class="date-cell">
              清场日期：
              <el-date-picker
                v-model="formData.clearanceDate"
                type="date"
                placeholder="选择日期"
                format="YYYY年MM月DD日"
                value-format="YYYY-MM-DD"
              />
            </td>
            <td class="info-cell info-cell-label">清场前批号：</td>
            <td class="info-cell info-cell-value">
              <el-input v-model="formData.batchBefore" />
            </td>
            <td class="info-cell info-cell-label">清场组员：</td>
            <td class="info-cell info-cell-value">
              <el-input v-model="formData.operator" />
            </td>
          </tr>
          <tr>
            <td class="info-cell info-cell-label">清场后批号：</td>
            <td class="info-cell info-cell-value">
              <el-input v-model="formData.batchAfter" />
            </td>
            <td class="info-cell info-cell-label">清场时间段：</td>
            <td class="info-cell info-cell-value">
              <el-time-picker v-model="formData.timeStart" format="HH:mm" /> 至
              <el-time-picker v-model="formData.timeEnd" format="HH:mm" />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 清场类型行 -->
      <table class="clearance-table" style="margin-top: -1px">
        <tbody>
          <tr>
            <td class="area-col">清场类型</td>
            <td class="type-option">
              <el-checkbox v-model="formData.clearanceType.batchChange"
                >换批清场</el-checkbox
              >
            </td>
            <td class="type-option">
              <el-checkbox v-model="formData.clearanceType.test"
                >试验批清场</el-checkbox
              >
            </td>
            <td class="type-option">
              <el-checkbox v-model="formData.clearanceType.shutdown"
                >停产清场</el-checkbox
              >
            </td>
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
        <tbody>
          <tr v-for="(item, index) in checkItems" :key="index">
            <td class="area-col">{{ item.category }}</td>
            <td class="content-col">
              <div class="check-items-wrapper">
                <el-checkbox-group v-model="item.checkedItems">
                  <el-checkbox
                    v-for="(subItem, subIndex) in item.items"
                    :key="subIndex"
                    :label="subItem.name"
                  />
                </el-checkbox-group>
              </div>
            </td>
            <td class="status-col">
              <el-radio-group v-model="item.status">
                <el-radio label="YES">YES</el-radio>
                <el-radio label="N/A">N/A</el-radio>
              </el-radio-group>
            </td>
            <td class="operator-col">
              <el-select
                v-if="item.category !== '操作间' && item.category !== '外包间'"
                v-model="item.operator"
                placeholder="选择清场人"
              >
                <el-option
                  v-for="op in operatorOptions"
                  :key="op"
                  :label="op"
                  :value="op"
                />
              </el-select>
            </td>
            <td class="date-col">
              <el-date-picker
                v-if="item.category !== '操作间' && item.category !== '外包间'"
                v-model="item.date"
                type="date"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 底部信息 -->
      <table class="clearance-table" style="margin-top: -1px">
        <tbody>
          <tr>
            <td class="info-label" width="80px">检查结果</td>
            <td>
              <el-input v-model="formData.checkResult" type="textarea" />
            </td>
          </tr>
        </tbody>
      </table>

      <table class="clearance-table" style="margin-top: -1px">
        <tbody>
          <tr>
            <td colspan="2">
              <el-input
                v-model="formData.others"
                type="textarea"
                placeholder="其他说明"
              />
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-input
                v-model="formData.remarks"
                type="textarea"
                placeholder="备注信息"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 添加清场组组长/日期信息 -->
      <div class="footer-info">
        <div class="signature-row">
          <span>清场组组长：</span>
          <el-input v-model="formData.leader" style="width: 100px" />
          <span>日期：</span>
          <el-date-picker v-model="formData.leaderDate" type="date" />
        </div>
        <div class="signature-row">
          <span>IP负责人：</span>
          <el-input v-model="formData.ipManager" style="width: 100px" />
          <span>日期：</span>
          <el-date-picker v-model="formData.ipManagerDate" type="date" />
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  clearanceDate: '',
  batchBefore: '',
  batchAfter: '',
  operator: '',
  timeStart: '',
  timeEnd: '',
  clearanceType: {
    batchChange: false,
    test: false,
    shutdown: false,
  },
  checkResult: '',
  others: '',
  remarks: '',
  leader: '',
  leaderDate: '',
  ipManager: '',
  ipManagerDate: '',
})

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
    checkedItems: [],
    status: '',
    operator: '',
    date: '',
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
    checkedItems: [],
    status: '',
    operator: '',
    date: '',
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
    checkedItems: [],
    status: '',
    operator: '',
    date: '',
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
    checkedItems: [],
    status: '',
    operator: '',
    date: '',
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
    checkedItems: [],
    status: '',
    operator: '',
    date: '',
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
    checkedItems: [],
    status: '',
    operator: '',
    date: '',
  },
])

// 添加清场人选项
const operatorOptions = ['王大', '王二', '王三']
</script>

<style scoped>
/* 继承 CheckList.vue 的样式 */
.check-list {
  padding: 20px;
  background: white;
}

/* 新增样式 */
.header-btns {
  display: flex;
  gap: 10px;
}

.signature-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

/* 调整表单元素样式 */
:deep(.el-input__inner) {
  height: 32px;
}

:deep(.el-checkbox) {
  margin-right: 10px;
  margin-bottom: 5px;
}

:deep(.el-radio) {
  margin-right: 10px;
}

/* 表格样式 */
.clearance-table {
  width: 960px;
  margin: 0 auto;
  border-collapse: collapse;
  table-layout: fixed;
  box-sizing: border-box !important;
}

/* 调整列宽度和对齐方式 */
.clearance-table th.area-col,
.clearance-table td.area-col,
.area-col {
  width: 80px !important;
  background-color: #fff;
  vertical-align: middle;
  text-align: center;
  box-sizing: border-box !important;
}

.status-col {
  text-align: center;
}

.operator-col {
  width: 140px !important;
  text-align: left;
}

.date-col {
  width: 180px !important;
  text-align: center;
}

.content-col {
  width: 480px !important;
  text-align: left;
}

.type-option {
  width: 240px !important;
  text-align: center;
}

.type-option:nth-child(3),
.type-option:nth-child(4) {
  width: 320px !important;
}

/* 调整输入框样式 */
:deep(.el-input__inner) {
  height: 32px;
  padding: 0 8px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
}

:deep(.el-textarea__inner) {
  /* border: none; */
  background: transparent;
  resize: none;
  padding: 0;
}

:deep(.el-checkbox) {
  margin-right: 4px;
  height: 32px;
  line-height: 32px;
}

:deep(.el-radio) {
  margin-right: 4px;
  height: 32px;
  line-height: 32px;
}

/* 调整日期选择器样式 */
:deep(.el-date-editor.el-input),
:deep(.el-date-editor.el-input__wrapper) {
  width: 180px;
}

:deep(.el-time-picker) {
  width: 90px;
}

/* 调整复选框组样式 */
.check-items-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px;
}

/* 调整单元格内容对齐 */
.clearance-table th,
.clearance-table td {
  border: 1px solid #000;
  padding: 8px;
  vertical-align: middle !important;
  font-size: 14px;
  box-sizing: border-box !important;
}

.info-cell-label {
  width: 120px !important;
  text-align: left;
}

.info-cell-value {
  width: 200px !important;
  text-align: left;
}

/* 特殊列宽度调整 */
.info-cell-label:nth-child(3),
.info-cell-label:nth-child(4) {
  width: 200px !important;
}

.info-cell-value:nth-child(3),
.info-cell-value:nth-child(4) {
  width: 160px !important;
}
.date-cell {
  width: 280px !important;
  text-align: left;
  vertical-align: middle;
  padding-left: 20px;
}

:deep(.date-cell .el-date-editor) {
  width: 180px;
  margin-left: 10px;
}

:deep(.date-cell .el-input__wrapper) {
  padding: 1px 11px;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
}

:deep(.date-cell .el-input__inner) {
  text-align: left;
}

/* 调整底部签名区域样式 */
.footer-info {
  margin-top: 20px;
  padding: 0 20px;
}

.signature-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.signature-row :deep(.el-input) {
  width: 100px;
}

/* 确保输入内容不会超出表格线 */
:deep(.el-input),
:deep(.el-date-editor),
:deep(.el-time-picker),
:deep(.el-checkbox-group),
:deep(.el-radio-group) {
  width: 100%;
  max-width: 100%;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
}

:deep(.el-radio-group) {
  display: flex;
  justify-content: center;
}

.type-option {
  width: 200px !important;
  text-align: center;
}

.type-option:nth-child(3) {
  width: 280px !important;
}
.type-option:nth-child(4) {
  width: 400px !important;
}
</style>
