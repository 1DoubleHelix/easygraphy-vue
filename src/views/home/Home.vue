<template>
  <router-view></router-view>
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
.nav-container {
  margin: 0;
  padding: 0;
}

.search {
  margin-bottom: 15px;
}

.main-container {
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
