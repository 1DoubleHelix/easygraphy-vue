<template>
  <div class="container">
    <n-button>首页</n-button>

    <n-h1>{{ blogInfo.title }}</n-h1>

    <div>
      <div v-html="blogInfo.content"></div>
    </div>
  </div>
</template>

<script setup>
import { AdminStore } from "../../stores/AdminStores";
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
moment.locale("zh-cn", momentCN);

const axios = inject("axios");

const router = useRouter();
const route = useRoute();

const blogInfo = ref({});

onMounted(() => {
  loadBlogs();
});

const loadBlogs = async () => {
  let res = await axios.get("/blog/detail?id=" + route.query.id);
  blogInfo.value = res.data.results;
  console.log(blogInfo.value);
  // console.log(route.query.id);
};
</script>

<style lang="scss">
.container {
  width: 1000px;
  margin: 0 auto;
}
:deep(img) {
  max-width: 100%;
}
</style>
