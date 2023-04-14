import { createApp, provide } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import axios from 'axios'
import { router } from './router/index'

axios.defaults.baseURL = "http://localhost:8088"

// 创建Vue对象 全局注册
const app = createApp(App)

// 全局配置axios 使用this.$http.get("/url")即可
// app.config.globalProperties.$http = axios
app.provide("axios", axios)
app.provide("serverURL", axios.defaults.baseURL) // 需要完整URL的地方直接注入

app.use(ElementPlus)
app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)


app.mount('#app')