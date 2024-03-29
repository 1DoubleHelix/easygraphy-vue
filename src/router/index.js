import { createRouter, createWebHashHistory } from "vue-router";

let routes = [
    { path: "/test", component: () => import("../views/Test.vue") },
    { path: "/detail", component: () => import("../views/knowledge/Detail.vue") },
    { path: '/', redirect: 'home' },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/home/Home.vue'),
        meta: {
            title: 'EasyGraphy'
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/dashboard/Dashboard.vue'),
        meta: {
            title: '后台管理-EasyGraphy'
        },
        children: [
            {
                path: "/dashboard/tag",
                component: () => import("../views/dashboard/Tag.vue")
            },
            {
                path: "/dashboard/blog",
                component: () => import("../views/dashboard/Blog.vue")
            }
        ]
    },
    {
        path: '/devices',
        name: 'devices',
        component: () => import('../views/devices/Devices.vue'),
        meta: {
            title: '设备库-EasyGraphy'
        }
    },
    {
        path: '/knowledge',
        name: 'knowledge',
        component: () => import('../views/knowledge/Knowledge.vue'),
        meta: {
            title: '知识区-EasyGraphy'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/Login.vue'),
        meta: {
            title: '登录-EasyGraphy'
        }
    },
    {
        path: '/member',
        name: 'member',
        component: () => import('../views/member/Member.vue'),
        meta: {
            title: '个人中心-EasyGraphy'
        }
    },
    {
        path: '/recommend',
        name: 'recommend',
        component: () => import('../views/recommend/Recommend.vue'),
        meta: {
            title: '套装推荐-EasyGraphy'
        }
    },


]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export { router, routes };