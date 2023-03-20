<template>
  <div class="main-container">
    <div class="wrapper">这里是大卡片，放网站的主要介绍，或者是轮播图</div>
    <el-row>
      <el-col :span="8">
        <div>这里是图片</div>
      </el-col>
      <el-col :span="16">
        <div>这里是介绍</div>
      </el-col>
    </el-row>
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

onMounted(() => {});
</script>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  .wrapper {
    height: 500px;
    background-color: #bfa;
  }
}
</style>
