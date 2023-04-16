<template>
  <div class="main-container">
    <el-container>
      <el-aside width="200px">
        <div class="avatar">
          <img :src="avatarUrl" alt="头像" />
        </div>
        <div class="nickname">{{ store.nickname }}</div>
        <el-menu
          :default-active="activeIndex"
          background-color="#fff"
          text-color="#3C393B"
          active-text-color="#000"
          router
        >
          <el-menu-item index="/space/info">个人信息</el-menu-item>
          <el-menu-item index="/space/blog">文章</el-menu-item>
          <el-menu-item index="/space/combine">我的组合</el-menu-item>
          <el-menu-item index="/space/favlist">全部收藏</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";
import { userStore } from "../../stores/userStore.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
const store = userStore();

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

const avatarUrl = ref("");
const activeIndex = ref("");

onMounted(() => {
  avatarUrl.value = "http://localhost:8088/images/avatar/" + store.id + ".jpg";
});
</script>

<style lang="scss" scoped>
.main-container {
  width: 1200px;
  margin: auto;
  // background-color: #bfa;
  .el-container {
    .el-aside {
      border-right: #dcdfe6 1px solid;
      .el-menu {
        border-right: none;
      }
      .avatar {
        margin-top: 20px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        img {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .nickname {
        margin-top: 10px;
        height: 20px;
        font-size: 20px;
        text-align: center;
        color: #666;
      }
    }
  }
}
</style>
