import { createRouter, createWebHashHistory } from "vue-router";

let routes = [
    { path: "/test", component: () => import("../views/Test.vue") },
    { path: "/detail", component: () => import("../views/knowledge/Detail.vue") },
    {
        // 主页
        path: '/home',
        name: 'home',
        component: () => import('../views/home/Home.vue'),
        meta: {
            title: 'EasyGraphy'
        },
    },
    {
        // 后台
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/dashboard/Dashboard.vue'),
        meta: {
            title: '后台管理-EasyGraphy'
        },
        children: [
            {
                path: "tag",
                component: () => import("../views/dashboard/Tag.vue")
            },
            {
                path: "blog",
                component: () => import("../views/dashboard/Blog.vue")
            }
        ]
    },
    {
        // 设备数据库
        path: '/devices',
        name: 'devices',
        component: () => import('../views/devices/Devices.vue'),
        meta: {
            title: '设备库-EasyGraphy'
        },
        children: [
            {
                path: "camera",
                component: () => import("../views/devices/Camera.vue")
            },
            {
                path: "lens",
                component: () => import("../views/devices/Lens.vue")
            }
        ]
    },
    {
        // 知识区
        path: '/knowledge',
        name: 'knowledge',
        component: () => import('../views/knowledge/Knowledge.vue'),
        meta: {
            title: '知识区-EasyGraphy'
        }
    },
    {
        // 设备推荐
        path: '/recommend',
        name: 'recommend',
        component: () => import('../views/recommend/Recommend.vue'),
        meta: {
            title: '套装推荐-EasyGraphy'
        },
        children: [
            // 挑选
            {
                path: 'combine',
                name: 'combine',
                component: () => import('../views/recommend/Combine.vue'),
                meta: {
                    title: '套装推荐-EasyGraphy'
                }
            },
            // 全部组合
            {
                path: 'combinations',
                name: 'combinations',
                component: () => import('../views/recommend/Combinations.vue'),
                meta: {
                    title: '套装推荐-EasyGraphy'
                }
            }
        ]
    },
    {
        // 登录
        path: '/login',
        name: 'login',
        component: () => import('../views/login/Login.vue'),
        meta: {
            title: '登录-EasyGraphy'
        }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export { router, routes };