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
  <div style="padding: 20px; width: 100%">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
// 自定义组件
import { useRouter, useRoute } from "vue-router";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

// 使用Naive的独立API 提示信息组件
const message = inject("message");
const dialog = inject("dialog");

const axios = inject("axios");

const activeIndex = ref("");
const handleSelect = (key, keyPath) => {
  // console.log(key);
  // switch (key) {
  //   case "1":
  //     router.push("/");
  //     break;
  // }
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.nav-container {
  margin: 0;
  padding: 0;
}

.search {
  margin-bottom: 15px;
}

.container {
  width: 1000px;
  margin: 0 auto;
}

.nav {
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: #64676a;

  div {
    cursor: pointer;
    margin-right: 15px;

    &:hover {
      color: orange;
    }

    span {
      font-size: 15px;
    }
  }
}
</style>
