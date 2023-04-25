<template>
  <!-- 登录、后台不加载导航栏 未实现 -->
  <NavBar v-if="showNavBar" class="nav-bar"></NavBar>
  <div class="router-view">
    <router-view></router-view>
  </div>
  <Footer v-if="showFooter" class="footer"></Footer>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";

const router = useRouter();
const route = useRoute();

// 登录页面不显示导航栏
const showNavBar = computed(() => route.meta.showNavBar !== false);
const showFooter = computed(() => route.meta.showFooter !== false);

onMounted(() => {});
</script>

<style scoped>
* {
  font-family: "Microsoft YaHei", Arial, Helvetica, sans-serif;
}
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}
.router-view {
  margin-top: 60px;
}
</style>
