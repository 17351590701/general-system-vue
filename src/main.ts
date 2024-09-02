
import { createApp } from 'vue'
//引入pinia
import { createPinia } from 'pinia'
//pinia数据持久化操作
import piniaPluginPersistence from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
//引入Element plus和css样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入ElementPlus的icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入自定义全局确认框
import myConfirm from './utils/myConfirm'
//按钮权限指令
import { permission } from '@/direvtive/permission'
import hasPerm from '@/direvtive/hasPerm'
//token权限认证
import './permission';
//echarts
import * as echarts from 'echarts'


const pinia = createPinia()
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
//pinia数据持久化挂载
pinia.use(piniaPluginPersistence)
app.use(ElementPlus, { locale: zhCn })
app.use(pinia)
app.directive('permission', permission)
app.use(router)

app.mount('#app')
//全局挂载自定义确认框
app.config.globalProperties.$myConfirm = myConfirm
app.config.globalProperties.$hasPerm = hasPerm
app.config.globalProperties.$echarts = echarts
