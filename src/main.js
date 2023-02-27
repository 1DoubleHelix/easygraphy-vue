import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import {createPinia} from 'pinia'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:8088"

// 创建Vue对象 全局注册
const app = createApp(App)
app.use(naive)
app.use(createPinia())

// 全局配置axios 使用this.$http.get("/url")即可
// app.config.globalProperties.$http = axios

app.mount('#app')