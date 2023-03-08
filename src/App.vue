<template>
<!--  <el-header class="nav-container">-->
<!--    &lt;!&ndash; 导航栏 &ndash;&gt;-->
<!--    <el-menu-->
<!--      :default-active="activeIndex"-->
<!--      class="el-menu-demo"-->
<!--      mode="horizontal"-->
<!--      background-color="#fff"-->
<!--      text-color="#3C393B"-->
<!--      active-text-color="#000"-->
<!--      @select="handleSelect"-->
<!--      router-->
<!--    >-->
<!--      <el-menu-item index="/home">首页</el-menu-item>-->
<!--      <el-menu-item index="/knowledge">知识区</el-menu-item>-->
<!--      <el-sub-menu index="/devices">-->
<!--        <template #title>设备数据库</template>-->
<!--        <el-menu-item index="/devices/all-camera">相机</el-menu-item>-->
<!--        <el-menu-item index="/devices/all-lens">镜头</el-menu-item>-->
<!--      </el-sub-menu>-->
<!--      <el-sub-menu index="/recommend">-->
<!--        <template #title>入门设备推荐</template>-->
<!--        <el-menu-item index="/recommend/combine">挑选</el-menu-item>-->
<!--        <el-menu-item index="/recommend/combinations">全部组合</el-menu-item>-->
<!--      </el-sub-menu>-->
<!--    </el-menu>-->
<!--  </el-header>-->
  <!-- 登录、后台不加载导航栏 未实现 -->
  <NavBar></NavBar>
  <router-view></router-view>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import NavBar from "./components/NavBar.vue";

const router = useRouter();
const route = useRoute();

onMounted(() => {});

</script>
<style scoped>
.nav-container {
  margin: 0;
  padding: 0;
}
</style>
