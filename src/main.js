import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import { createPinia } from 'pinia'
import axios from 'axios'
import { router } from './router/index'

axios.defaults.baseURL = "http://localhost:8088"
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

app.use(naive)
app.use(createPinia())
app.use(router)



app.mount('#app')