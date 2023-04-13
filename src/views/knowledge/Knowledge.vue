<template>
  <div class="main-container">
    <el-container>
      <el-aside>
        <div class="tag">
          <div @click="resetTag" class="title">全部文章</div>
          <div
            v-for="(tag, index) in tagList"
            @click="changeTag(tag)"
            class="title"
          >
            {{ tag.name }}
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="blog-list-header">全部文章</div>
        <div class="blog-container">
          <div
            v-for="(blog, index) in blogListInfo"
            @click="toDetail(blog)"
            class="blog"
          >
            <div class="blog-content">
              <div class="header">
                <span>{{ blog.title }}</span>
                <div>{{ blog.create_time }}</div>
              </div>
              <div class="main">
                <img :src="blog.img || imgsrc" alt="" />
                <div>{{ blog.nickname }}</div>
              </div>
            </div>
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
  <div class="bg"></div>
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
  pageSize: 9,
  count: 0,
  keyword: "",
  tagId: 0,
});

// tag列表
const tagList = ref([]);
const blogListInfo = ref([]);
const imgsrc = ref(
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
);

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
  margin-top: 300px;
  .el-aside {
    background-color: #fff;
    width: 200px;
    margin: 10px;
    .title {
      cursor: pointer;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      text-align: center;
      width: 170px;
      border-radius: 3px;
      margin: 15px auto;
      background-color: #eaf2ff;
    }
  }
  .el-main {
    background-color: #fff;
    margin: 10px;
    .blog-container {
      // height: 600px;
      position: relative;
      padding-bottom: 40px;
      .blog {
        width: 100%;
        background-color: #fff;
        margin: 20px auto;
        cursor: pointer;
        border-radius: 10px;
        padding: 10px 10px;
        box-sizing: border-box;
        .blog-content {
          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
          }
          .main {
            display: flex;
            margin-top: 8px;
            img {
              width: 30px;
              height: 30px;
              background-color: white;
              border: 1px solid #000;
              border-radius: 50%;
              margin-right: 10px;
            }
            div:nth-child(2) {
              line-height: 30px;
            }
          }
        }
      }
      .el-pagination {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
  }
}
.bg {
  position: fixed;
  top: 0;
  z-index: -1;
  height: 100vh;
  width: 100vw;
  background-color: #f2f3f5;
  // background-image: url("@/assets/picture/12.jpg");
  // background-size: cover;
}
</style>
