<template>
  <div class="container">
    <div class="nav">
      <div @click="home">首页</div>
      <div>
        <n-popselect
          @update:value="searchByTag"
          v-model:value="selectedTag"
          :options="tagOptions"
          trigger="click"
        >
          <div>
            标签<span>{{ tagName }}</span>
          </div>
        </n-popselect>
      </div>
      <div @click="dahsboard">后台</div>
    </div>

    <n-divider />

    <n-space class="search">
      <n-input
        v-model:value="pageInfo.keyword"
        :style="{ width: '500px' }"
        placeholder="请输入关键字"
      />
      <n-button type="primary" ghost @click="loadBlogs(0)"> 搜索 </n-button>
    </n-space>

    <div
      v-for="(blog, index) in blogListInfo"
      style="margin-bottom: 15px; cursor: pointer"
    >
      <n-card :title="blog.title" @click="toDetail(blog)">
        {{ blog.content }}
        <template #footer>
          <n-space align="center">
            <div>发布时间：{{ blog.create_time }}</div>
          </n-space>
        </template>
      </n-card>
    </div>

    <n-pagination
      @update:page="loadBlogs"
      v-model:page="pageInfo.page"
      :page-count="pageInfo.pageCount"
    />
    <n-divider />

    <div class="footer">
      <div>power by xxxxx</div>
      <div>dddddd</div>
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

const router = useRouter();
const route = useRoute();

// 使用Naive的独立API 提示信息组件
const message = inject("message");
const dialog = inject("dialog");

const axios = inject("axios");

const selectedTag = ref(0);
const tagOptions = ref([]);
const blogListInfo = ref([]);

onMounted(() => {
  loadTags();
  loadBlogs();
});

// 分页参数
const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  count: 0,
  pageCount: 0,
  keyword: "",
  tagId: 0,
});

// 读取文章列表
const loadBlogs = async (page = 0) => {
  if (page != 0) {
    pageInfo.page = page;
  }
  let res = await axios.get(
    `/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&tagId=${pageInfo.tagId}`
  );

  let rows = res.data.data.rows;
  for (let row of rows) {
    // 内容已裁剪至50个字符 这里追加省略号
    row.content += " ...";
    // 时间戳格式化
    row.create_time = moment(row.create_time).format("lll");
  }
  blogListInfo.value = rows;

  // 算总页码
  pageInfo.count = res.data.data.count;
  pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);

  console.log(res);
};

const tagName = computed(() => {
  //获取选中的分类
  let selectedOption = tagOptions.value.find((option) => {
    return option.value == selectedTag.value;
  });
  //返回分类的名称
  return selectedOption ? selectedOption.label : "";
});

// 加载标签数据
const loadTags = async () => {
  let res = await axios.get("/tag/list");
  // console.log(res.data.results);
  // 转换data格式到naive选项的格式
  tagOptions.value = res.data.results.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  // console.log(tagOptions.value);
};

const searchByTag = (tagId) => {
  pageInfo.tagId = tagId;
  loadBlogs();
  // console.log(event);
};

// 跳转到详情页
const toDetail = (blog) => {
  router.push({ path: "/detail", query: { id: blog.id } });
};

// 跳转路由
const home = () => {
  router.push("/");
};
const dahsboard = () => {
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.search {
  margin-bottom: 15px;
}
.container {
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
