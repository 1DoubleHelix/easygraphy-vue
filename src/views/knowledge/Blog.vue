<template>
  <div class="main-container">
    <h1>{{ blogInfo.title }}</h1>
    <div v-if="token" class="favorite" @click="favorite">
      <el-button v-if="favoriteId === ''">收藏</el-button>
      <el-button v-else>取消收藏</el-button>
    </div>
    <div v-html="blogInfo.content"></div>
    <div class="comment-area">
      <Comment type="blog" :id="route.query.id" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
// 自定义组件
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import { ElMessage } from "element-plus";
import Comment from "../../components/Comment.vue";
import { userStore } from "../../stores/userStore.js";
import { storeToRefs } from "pinia";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

const store = userStore();
let { token } = storeToRefs(store);

const blogInfo = ref({});
let commentsInfo = ref([]);
const textarea = ref("");
const favoriteId = ref("");

onMounted(() => {
  loadBlogs();
  loadFavorite();
});

const loadBlogs = async () => {
  let res = await api.blogDetail(route.query.id);
  console.log(res);
  blogInfo.value = res.results;
};

// 加载收藏状态
const loadFavorite = async () => {
  let res = await api.favoriteList({
    kind: "blog",
    id: route.query.id,
  });

  console.log(res);

  // 寻找收藏条目
  let index = res.data.rows.findIndex((item) => item.blog_id == route.query.id);

  if (index != -1) {
    favoriteId.value = res.data.rows[index].id;
  }
  console.log(favoriteId.value);
};

// 修改收藏状态
const favorite = async () => {
  if (favoriteId.value == "") {
    // 添加
    let res = await api.favoriteAdd({
      kind: "blog",
      objectId: route.query.id,
    });
    console.log(res);
    favoriteId.value = res.id;
  } else {
    // 取消
    let res = await api.favoriteDelete(favoriteId.value);
    favoriteId.value = "";
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 1200px;
  margin: auto;
}
</style>
