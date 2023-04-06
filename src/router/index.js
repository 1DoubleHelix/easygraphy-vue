import { createRouter, createWebHashHistory } from "vue-router";

let routes = [
    { path: "/detail", component: () => import("../views/knowledge/Detail.vue") },
    {
        // 主页
        path: '/home',
        name: 'home',
        component: () => import('../views/home/Home.vue'),
        meta: { title: 'EasyGraphy' },
    },
    {
        // 后台
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/dashboard/Dashboard.vue'),
        meta: { requireAdmin: true, showNavBar: false, title: '后台管理-EasyGraphy' },
        children: [
            {
                path: "tag",
                component: () => import("../views/dashboard/Tag.vue")
            },
            {
                path: "blog",
                component: () => import("../views/dashboard/Blog.vue")
            },
            {
                path: "user",
                component: () => import("../views/dashboard/User.vue")
            },
            {
                path: "devices",
                component: () => import("../views/dashboard/Devices.vue"),
            },
        ]
    },
    {
        // 设备数据库
        path: '/devices',
        name: 'devices',
        children: [
            {
                path: "all-camera",
                component: () => import("../views/devices/AllCamera.vue")
            },
            {
                path: "all-lens",
                component: () => import("../views/devices/AllLens.vue")
            },
            {
                path: "camera",
                component: () => import("../views/devices/Camera.vue"),
            },
            {
                path: "lens",
                component: () => import("../views/devices/Lens.vue"),
            }
        ]
    },
    {
        // 知识区
        path: '/knowledge',
        name: 'knowledge',
        children: [
            {
                path: 'all',
                component: () => import('../views/knowledge/Knowledge.vue'),
            },
            {
                path: 'blog',
                component: () => import('../views/knowledge/Blog.vue'),
            }
        ]
    },
    {
        // 设备推荐
        path: '/recommend',
        name: 'recommend',
        children: [
            {
                path: 'helper',
                component: () => import('../views/recommend/Helper.vue'),
                meta: { title: '套装推荐-EasyGraphy' }
            },
            // 挑选
            {
                path: 'combine',
                component: () => import('../views/recommend/Combine.vue'),
                meta: { title: '套装推荐-EasyGraphy' }
            },
            // 全部组合
            {
                path: 'combinations',
                component: () => import('../views/recommend/Combinations.vue'),
                meta: { title: '套装推荐-EasyGraphy' }
            },
            // 组合详情页
            {
                path: 'detail',
                component: () => import('../views/recommend/Detail.vue'),
                meta: { title: '套装推荐-EasyGraphy' }
            },
        ]
    },
    {
        // 管理员登录
        path: '/login-admin',
        name: 'login-admin',
        component: () => import('../views/login/LoginAdmin.vue'),
        meta: { title: '登录-EasyGraphy' }
    },
    {
        // 普通用户登录
        path: '/login',
        name: 'login',
        component: () => import('../views/login/Login.vue'),
        meta: { showNavBar: false }
    },
    {
        // 个人中心
        path: '/space',
        name: 'space',
        component: () => import('../views/space/Space.vue'),
        meta: { requireAuth: true },
        children: [
            {
                path: 'blog',
                component: () => import('../views/space/Blog.vue')
            },
            {
                path: 'favlist',
                component: () => import('../views/space/FavList.vue')
            },
            {
                path: 'combine',
                component: () => import('../views/space/Combine.vue')
            },
            {
                path: 'info',
                component: () => import('../views/space/Info.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// 登录 导航守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('main');

    // 如果meta字段有requireAuth字段，且为true，且token不存在，则跳转到登录页面
    if (to.meta.requireAuth && !token) {
        next('/login')
    }
    // 后台管理 requireAdmin
    else if (to.meta.requireAdmin && !token) {
        next('/login-admin');
    }

    else {
        next();
    }

});

export { router, routes };