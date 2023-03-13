<template>
  <el-container>
    <el-aside width="200px">
      <div class="avatar">
        <img src="../../assets/avatar/default.jpeg" alt="avatar" />
      </div>
      <div class="nav">
        <router-link to="/space/blog">文章</router-link>
        <router-link to="/space/combine">组合</router-link>
        <router-link to="/space/favlist">收藏</router-link>
      </div>
      <div class="combine">combine card</div>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";
import { userStore } from "../../stores/userStore.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import request from "../../utils/request";
const store = userStore();

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

onMounted(() => {});
</script>

<style lang="scss" scoped>
.el-container {
  width: 1200px;
  margin: auto;
  background-color: #bfa;

  .el-aside {
    background-color: rgb(151, 132, 219);
    .avatar {
      width: 100%;
      height: 200px;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .nav {
      width: 100%;
      height: 300px;
      margin-top: 10px;
      background-color: #c75858;
    }
    .combine {
      width: 100%;
      height: 300px;
      margin-top: 10px;
      background-color: #fff;
    }
  }
}
</style>
