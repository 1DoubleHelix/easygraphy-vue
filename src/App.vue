<template>
  <!-- 登录、后台不加载导航栏 未实现 -->
  <NavBar v-if="showNavBar" class="nav-bar"></NavBar>
  <div class="router-view">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import NavBar from "./components/NavBar.vue";

const router = useRouter();
const route = useRoute();

// 登录页面不显示导航栏
const showNavBar = computed(() => route.meta.showNavBar !== false);

onMounted(() => {});
</script>
<style scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}
.router-view {
  margin-top: 59px;
}
</style>
