<template>
  <div class="pagination">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 50]"
      :small="small"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @update:current-page="$emit('update:currentPage', $event)"
      @update:page-size="$emit('update:pageSize', $event)"
      @size-change="$emit('size-change', $event)"
      @current-change="$emit('current-change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, default: 0 },
  small: { type: Boolean, default: false }
})

defineEmits(['update:currentPage', 'update:pageSize', 'size-change', 'current-change'])
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-right: 20px;
}
</style>