<template>
  <div class="main-container">
    <h1>{{ blogInfo.title }}</h1>

    <div v-html="blogInfo.content"></div>

    <div class="comment-area">
      <Comment type="blog" :id="route.query.id" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
// 自定义组件
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import { ElMessage } from "element-plus";
import Comment from "../../components/Comment.vue";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

const blogInfo = ref({});
let commentsInfo = ref([]);
const textarea = ref("");

onMounted(() => {
  loadBlogs();
});

const loadBlogs = async () => {
  let res = await api.blogDetail(route.query.id);
  console.log(res);
  blogInfo.value = res.results;
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 1200px;
  margin: auto;
}
</style>
