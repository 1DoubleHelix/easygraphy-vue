<template>
  <div class="main-container">
    <el-container>
      <el-aside>
        <div class="tag">
          <div @click="resetTag">全部文章</div>
          <div v-for="(tag, index) in tagList" @click="changeTag(tag)">
            {{ tag.name }}
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="blog-list-header">全部文章</div>
        <div class="blog-container">
          <div v-for="(blog, index) in blogListInfo" @click="toDetail(blog)">
            <el-card shadow="hover">
              <div class="header">
                <span>{{ blog.title }}</span>
              </div>
              <div>{{ blog.create_time }}</div>
            </el-card>
          </div>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="pageInfo.count"
            :page-size="pageInfo.pageSize"
            v-model:current-page="pageInfo.page"
            @update:current-page="loadBlogs()"
          />
        </div>
      </el-main>
    </el-container>
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

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

// 查询和分页参数
const pageInfo = reactive({
  page: 1,
  pageSize: 5,
  count: 0,
  keyword: "",
  tagId: 0,
});

// tag列表
const tagList = ref([]);
const blogListInfo = ref([]);

onMounted(() => {
  loadTags();
  loadBlogs();
});

// 切换文章分类
const changeTag = (tag) => {
  pageInfo.tagId = tag.id;
  pageInfo.page = 1;
  loadBlogs();
};
const resetTag = () => {
  pageInfo.tagId = 0;
  pageInfo.page = 1;
  loadBlogs();
};

// 加载标签
const loadTags = async () => {
  let res = await api.tagList();
  if (res.code == 200) {
    tagList.value = res.results;
  } else {
    ElMessage({ message: res.msg, type: "warning" });
  }
};

// 读取文章列表
const loadBlogs = async () => {
  let res = await api.searchBlog(pageInfo);
  let rows = res.data.rows;
  for (let row of rows) {
    // 内容已裁剪至50个字符 这里追加省略号
    row.content += " ...";
    // 时间戳格式化
    row.create_time = moment(row.create_time).format("lll");
  }
  blogListInfo.value = rows;
  pageInfo.count = res.data.count;
};

// 跳转详情页
const toDetail = (blog) => {
  router.push({ path: "/knowledge/blog", query: { id: blog.id } });
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 1200px;
  margin: auto;
  .el-aside {
    background-color: #fba;
  }
  .el-main {
    background-color: rgb(194, 194, 194);
  }
}
</style>
