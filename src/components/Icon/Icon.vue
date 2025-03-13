<template>
  <svg
    :viewBox="iconItem.viewBox"
    :aria-label="code"
    class="icon"
    v-bind="otherProps"
  >
    <path
      v-for="(path, index) in iconItem.list"
      :key="index"
      :d="path.d"
      :fill="color || path.fill || '#ccc'"
    />
  </svg>
</template>

<script setup>
import { computed, toRefs } from 'vue'
import icons from './icons.json'

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
})

const { code, color, ...otherProps } = toRefs(props)

const iconItem = computed(() => {
  const item = icons[code.value]
  if (!item) {
    return {
      viewBox: '0 0 1024 1024',
      list: [
        {
          d: 'M512 0a512 512 0 1 0 512 512A512 512 0 0 0 512 0z m0 808.96a67.697778 67.697778 0 0 1-66.939259-66.56A65.422222 65.422222 0 0 1 512 675.84a66.56 66.56 0 0 1 66.939259 66.56A65.611852 65.611852 0 0 1 512 808.96zM688.355556 436.148148a446.198519 446.198519 0 0 1-84.954075 84.574815 171.994074 171.994074 0 0 0-41.718518 45.131852 154.168889 154.168889 0 0 0-7.205926 59.922963h-95.952593v-25.6a180.148148 180.148148 0 0 1 16.308149-75.851852 246.518519 246.518519 0 0 1 61.629629-66.56 392.912593 392.912593 0 0 0 55.940741-48.545185A66.37037 66.37037 0 0 0 606.814815 369.777778a67.697778 67.697778 0 0 0-23.514074-52.148148 103.158519 103.158519 0 0 0-66.93926-21.617778 94.814815 94.814815 0 0 0-66.939259 23.514074 134.826667 134.826667 0 0 0-37.925926 68.266667c-3.602963 18.014815-97.659259 27.117037-95.762963-12.515556a153.220741 153.220741 0 0 1 56.888889-113.777778A207.265185 207.265185 0 0 1 512 215.04a215.22963 215.22963 0 0 1 144.687407 46.838519 135.395556 135.395556 0 0 1 52.527408 107.899259 119.656296 119.656296 0 0 1-20.859259 66.37037z',
        },
      ],
    }
  }
  return {
    viewBox: item.viewBox,
    list: item.paths,
  }
})
</script>

<style scoped>
.icon {
  width: 1.2rem;
  height: 1.2rem;
  display: inline-block;
  vertical-align: middle;
}
</style>
