<template>
  <div>{{ lensInfo }}</div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";

moment.locale("zh-cn", momentCN);

const axios = inject("axios");

const router = useRouter();
const route = useRoute();

let lensInfo = ref({});

onMounted(() => {
  loadLens();
});

// 加载镜头数据
const loadLens = async () => {
  let res = await axios.get("/lens/detail?id=" + route.query.id);
  lensInfo.value = res.data.results;
};
</script>

<style lang="scss" scoped></style>
