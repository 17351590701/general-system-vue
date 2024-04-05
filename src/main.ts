import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
//引入Element plus和css样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入ElementPlus的icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
