import { createApp } from 'vue'
//创建pinia
import { createPinia } from 'pinia'
//pinia数据持久化操作
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
//引入Element plus和css样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入ElementPlus的icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const pinia =createPinia()
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
//pinia数据持久化挂载
pinia.use(piniaPluginPersistedstate)
app.use(ElementPlus)
app.use(pinia)
app.use(router)

app.mount('#app')
