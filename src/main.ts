import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css'

const app = createApp(App)

initAMapApiLoader({
  key: import.meta.env.VITE_AMAP_API_KEY,
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE, // 新增安全密钥
})

app.use(router)
app.use(ElementPlus)
app.use(VueAMap)
app.mount('#app')
