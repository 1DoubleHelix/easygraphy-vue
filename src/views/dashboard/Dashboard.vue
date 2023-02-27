<!-- 管理员后台 -->
<template>
  <div class="main-panel">
    <div class="menus">
      <div v-for="(menu, index) in menus" @click="toPage(menu)">
        {{ menu.name }}
      </div>
    </div>
    <div style="padding:20px;width:100%">
      <!--二级路由-->
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, inject} from "vue";
import {AdminStore} from "../../stores/AdminStores";
import {useRouter, useRoute} from 'vue-router'

const router = useRouter();
const route = useRoute();
const adminStore = AdminStore();

const axios = inject("axios");
// 提示信息 使用Naive的独立API
const message = inject("message");

// 菜单
let menus = [
  {name: "文章管理", href: "/dashboard/blog"},
  {name: "标签管理", href: "/dashboard/tag"},
  {name: "退出", href: "logout"},
];

// 路由跳转
const toPage = (menu) => {
  if (menu.href == 'logout') {
    // 注销 回到登录页面
    router.push("/login")
  } else {
    router.push(menu.href)
  }
}

</script>

<style lang="scss" scoped>
.main-panel {
  display: flex;
  color: #64676a;
  max-width: 1500px;
  margin: 0 auto;
}

.menus {
  padding: 20px 0;
  box-sizing: border-box;
  line-height: 55px;
  text-align: center;
  width: 180px;
  height: 95vh;
  border-right: 1px solid #dadada;

  div {
    cursor: pointer;

    &:hover {
      color: #fd760e;
    }
  }
}

.title {
  font-size: 65px;
  font-weight: bold;
  text-align: right;
  position: fixed;
  color: rgba(0, 0, 0, 20%);
  right: calc((100vw - 1500px) / 2);
  bottom: 20px;
}
</style>