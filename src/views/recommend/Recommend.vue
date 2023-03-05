<template>
  <div>
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
        <el-menu-item index="/knowledge">知识区</el-menu-item>
        <el-sub-menu index="/devices">
          <template #title>设备数据库</template>
          <el-menu-item index="/devices/camera">相机</el-menu-item>
          <el-menu-item index="/devices/lens">镜头</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/recommend">
          <template #title>入门设备推荐</template>
          <el-menu-item index="/recommend/combine">挑选</el-menu-item>
          <el-menu-item index="/recommend/combinations">全部组合</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-header>
  </div>
  <router-view></router-view>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
// 自定义组件
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const activeIndex = ref("");
const handleSelect = (key) => {};
</script>

<style lang="scss" scoped>
.nav-container {
  margin: 0;
  padding: 0;
}
</style>
