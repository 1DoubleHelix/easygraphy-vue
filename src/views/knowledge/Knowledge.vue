<template>
  <router-view></router-view>
</template>

<script setup>
import { AdminStore } from "../../stores/AdminStores";
import { ref, reactive, inject, onMounted, computed } from "vue";
// 自定义组件
import { useRouter, useRoute } from "vue-router";
// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();
</script>

<style lang="scss" scoped></style>
