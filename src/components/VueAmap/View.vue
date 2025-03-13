<template>
  <el-amap
    vid="amapDemo"
    :zoom="defaultZoom"
    :center="defaultCenter"
    style="width: 100%; height: 100%"
  ></el-amap>
</template>

<script setup>
const defaultZoom = 14
const defaultCenter = [121.544914, 29.841356]
</script>

<style scoped>
#amapDemo {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
