import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import axios from 'axios'
import { router } from './router/index'

axios.defaults.baseURL = "http://localhost:8088"
// axios.interceptors.request.use((config) => {
//     if (["/user/login", "/user/register"].indexOf(config.url) === 1) {
//         const token = localStorage.getItem("token")
//         if (token) {
//             config.headers.Authorization = token
//         }
//     }
// })
// 独立API
const { message, notification, dialog } = createDiscreteApi(["message", "notification", "dialog"])

// 创建Vue对象 全局注册
const app = createApp(App)

// 全局配置axios 使用this.$http.get("/url")即可
// app.config.globalProperties.$http = axios
app.provide("axios", axios)
app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)
app.provide("serverURL", axios.defaults.baseURL) // 需要完整URL的地方直接注入

app.use(naive)
app.use(ElementPlus)
app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)


app.mount('#app')