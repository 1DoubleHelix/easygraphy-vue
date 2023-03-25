<!-- 管理员后台 -->
<template>
  <el-container>
    <el-aside width="200px">
      <!-- 侧边导航栏 -->
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        background-color="#fff"
        text-color="#3C393B"
        active-text-color="#000"
        router
      >
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/dashboard/blog">文章管理</el-menu-item>
        <el-menu-item index="/dashboard/tag">标签管理</el-menu-item>
        <el-menu-item index="/dashboard/user">用户管理</el-menu-item>
        <el-menu-item index="/dashboard/devices">设备管理</el-menu-item>
        <el-menu-item index="/login-admin">退出</el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <div style="width: 100%">
        <!--二级路由-->
        <router-view></router-view>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const axios = inject("axios");
// 提示信息 使用Naive的独立API
const message = inject("message");

const activeIndex = ref("");
</script>

<style lang="scss" scoped>
.el-container {
  margin-top: -60px;
}
</style>
