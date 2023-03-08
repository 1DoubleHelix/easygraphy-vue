<template>
  <div>
    <el-header class="nav-container">
      <!-- 导航栏 -->
      <el-row>
        <el-col :span="4" class="logo">
          <img src="../assets/logo.svg" alt="logo" />
        </el-col>
        <el-col :span="16" class="nav-menu">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#fff"
            text-color="#3C393B"
            active-text-color="#000"
            @select="handleSelect"
            router
          >
            <el-menu-item index="/home">首页</el-menu-item>
            <el-menu-item index="/knowledge">知识区</el-menu-item>
            <el-sub-menu index="/devices">
              <template #title>设备数据库</template>
              <el-menu-item index="/devices/all-camera">相机</el-menu-item>
              <el-menu-item index="/devices/all-lens">镜头</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/recommend">
              <template #title>入门设备推荐</template>
              <el-menu-item index="/recommend/combine">挑选</el-menu-item>
              <el-menu-item index="/recommend/combinations"
                >全部组合
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-col>
        <el-col :span="4" class="login-menu">
          <div class="user-avatar" v-if="token">
            <el-popover :visible="visible" placement="bottom" :width="150">
              <div style="text-align: center; margin: 0">
                <p
                  style="margin-bottom: 10px; cursor: pointer"
                  @click="toCenter"
                >
                  个人中心
                </p>
                <p style="cursor: pointer" @click="logout">退出</p>
              </div>
              <template #reference>
                <el-button @click="visible = true">个人中心</el-button>
              </template>
            </el-popover>
          </div>
          <div v-else>
            <el-button @click="login">登录 | 注册</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { userStore } from "../stores/userStore.js";

const router = useRouter();
const route = useRoute();

const store = userStore();

onMounted(() => {});

// const token = ref(store.token);
let { token } = storeToRefs(store);

const activeIndex = ref("");
const handleSelect = (key) => {};

const login = () => {
  router.push("/login");
};
const logout = () => {
  router.push("/logout");
};
// 跳转到个人页面 应改用post好些
const toCenter = (id) => {
  router.push({ path: "/center", query: { id: id } });
};
</script>

<style lang="scss" scoped>
.nav-container {
  margin: 0;
  padding: 0;

  .logo {
    position: relative;
    border-bottom: 1px solid #dcdfe6;
    img {
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .login-menu {
    position: relative;
    border-bottom: 1px solid #dcdfe6;
    div {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
