import axios from "axios";
import { ElMessage } from "element-plus";
import { userStore } from "../stores/userStore.js";

const store = userStore()

// 创建实例
const request = axios.create({
    baseURL: "http://localhost:8088",
    timeout: 20000
})

// 请求拦截器 添加请求头
request.interceptors.request.use((config) => {
    if (store.token) {
        config.headers.Authorization = store.token
    }
    return config
})

// 响应拦截器
request.interceptors.response.use((res) => {
    // 如果发现token过期 清除store并跳转登录页面

    // 这里要做错误状态码处理 暂时放在这
    // if (res.status !== 200) {
    //     return ElMessage.error(res.data.msg)
    // }
    return res.data
})

export default request;
