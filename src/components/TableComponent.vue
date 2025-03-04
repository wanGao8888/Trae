<template>
  <div class="table-component" :style="{ width: tableWidth, height: tableHeight }">
    <table style="width: 100%;">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header" :style="{ textAlign: headerAlign } as CSSProperties">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in currentPageData" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex" :style="{ textAlign: bodyAlign } as CSSProperties">
            <slot :name="`cell-${rowIndex}-${cellIndex}`" :row="row" :rowIndex="rowIndex" :cellIndex="cellIndex" :value="cell">
              {{ cell }}
            </slot>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td :colspan="headers ? headers.length : 1" :style="{ textAlign: footerAlign } as CSSProperties">{{ footer }}</td>
        </tr>
      </tfoot>
    </table>
    <Pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, type CSSProperties, ref, computed } from 'vue'
import Pagination from './Pagination.vue'

const props = defineProps({
  headers: Array as () => string[],
  rows: Array as () => Array<Array<any>>,
  footer: String,
  tableWidth: { type: String, default: '100%' },
  tableHeight: { type: String, default: 'auto' },
  headerAlign: { type: String, default: 'center' },
  bodyAlign: { type: String, default: 'center' },
  footerAlign: { type: String, default: 'right' }
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => props.rows?.length || 0)

const currentPageData = computed(() => {
  if (!props.rows) return []
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.rows.slice(start, end)
})

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}
</script>

<style scoped>
.table-component {
  border-collapse: collapse;
  width: 100%;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #ddd;
  padding: 0;
  height: 2.5em;
  margin: 0;
}

th {
  background-color: #f2f2f2;
}

tfoot td {
  font-weight: bold;
  height: 3em;
}
</style>