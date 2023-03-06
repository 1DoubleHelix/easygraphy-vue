<!-- 管理员后台 -->
<template>
  <div class="nav-container">
    <el-header class="nav-container">
      <!-- 导航栏 -->
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleSelect"
          router
      >
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/dashboard/blog">文章管理</el-menu-item>
        <el-menu-item index="/dashboard/tag">标签管理</el-menu-item>
        <el-menu-item index="/dashboard/user">用户管理</el-menu-item>
        <el-menu-item index="/dashboard/devices">设备管理</el-menu-item>

        <el-menu-item index="/login-admin">退出</el-menu-item>
      </el-menu>
    </el-header>
  </div>
  <div style="padding: 20px; width: 100%">
    <!--二级路由-->
    <router-view></router-view>
  </div>
</template>

<script setup>
import {ref, reactive, inject} from "vue";
import {AdminStore} from "../../stores/AdminStores";
import {useRouter, useRoute} from "vue-router";

const router = useRouter();
const route = useRoute();
const adminStore = AdminStore();

const axios = inject("axios");
// 提示信息 使用Naive的独立API
const message = inject("message");

const activeIndex = ref("");
const handleSelect = (key) => {
  // console.log(activeIndex.value);
  // switch (key) {
  //   case "1":
  //     router.push("/home");
  //     break;
  // }
};
</script>

<style lang="scss" scoped>
.nav-container {
  margin: 0;
  padding: 0;
}

.flex-grow {
  flex-grow: 1;
}

</style>
