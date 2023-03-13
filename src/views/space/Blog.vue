<template>
  <div class="main-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="我的文章"></el-tab-pane>
      <el-tab-pane label="编写文章"></el-tab-pane>
      <el-tab-pane label="修改文章"></el-tab-pane>
    </el-tabs>
    <div class="blog-list">
      <div v-for="(blog, index) in blogInfo">
        <el-card>
          <div class="header">
            <span>{{ blog.title }}</span>
            <el-button @click="toUpdate">修改</el-button>
            <el-button @click="deleteBlog">删除</el-button>
          </div>
          <div>{{ blog.content }}</div>
          <div>{{ blog.create_time }}</div>
        </el-card>
      </div>
    </div>
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
import request from "../../utils/request";
const store = userStore();

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

const blogInfo = ref({});
const blogPageInfo = reactive({
  page: 1,
  pageSize: 4,
  count: 0,
});

onMounted(() => {
  loadBlogs();
});

const loadBlogs = async () => {
  let res = await api.searchBlog({ userID: store.id });
  let rows = res.data.rows;
  for (let row of rows) {
    // 内容已裁剪至50个字符 这里追加省略号
    row.content += " ...";
    // 时间戳格式化
    row.create_time = moment(row.create_time).format("lll");
  }
  blogInfo.value = rows;
  console.log(blogInfo.value);
};

const toUpdate = (blog) => {
  router.push({
    path: "/dashboard/blog/update",
    query: {
      id: blog.id,
    },
  });
};

const deleteBlog = async (blog) => {
  let res = await api.deleteBlog(blog.id);
  if (res.data.code === 200) {
    loadBlogs();
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
</style>
