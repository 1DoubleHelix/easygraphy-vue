<template>
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
