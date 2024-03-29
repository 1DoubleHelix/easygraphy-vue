<template>
  <n-tabs v-model:value="tabValue" type="line" animated>
    <n-tab-pane name="list" tab="文章列表">
      <div v-for="(blog, index) in blogListInfo" style="margin-bottom: 15px">
        <n-card :title="blog.title">
          {{ blog.content }}
          <template #footer>
            <n-space align="center">
              <div>发布时间：{{ blog.create_time }}</div>
              <n-button @click="toUpdate(blog)">修改</n-button>
              <n-button @click="deleteBlog(blog)">删除</n-button>
            </n-space>
          </template>
        </n-card>
      </div>
      <n-space>
        <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount">
          <div :style="'color:' + (pageNum == pageInfo.page ? 'blue' : '')">
            {{ pageNum }}
          </div>
        </div>
      </n-space>
    </n-tab-pane>
    <n-tab-pane name="add" tab="添加文章">
      <n-form>
        <n-form-item label="标题">
          <n-input v-model:value="addBlogTemp.title" placeholder="请输入标题" />
        </n-form-item>
        <n-form-item label="选择文章标签">
          <n-select v-model:value="addBlogTemp.tagId" :options="tagOptions" />
        </n-form-item>
        <n-form-item label="文章内容">
          <RichTextEditor v-model="addBlogTemp.content"></RichTextEditor>
        </n-form-item>
        <n-form-item label="">
          <n-button @click="addBlog">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
    <n-tab-pane name="update" tab="修改文章">
      <n-form>
        <n-form-item label="标题">
          <n-input
            v-model:value="updateBlogTemp.title"
            placeholder="请输入标题"
          />
        </n-form-item>
        <n-form-item label="选择文章标签">
          <n-select
            v-model:value="updateBlogTemp.tagId"
            :options="tagOptions"
          />
        </n-form-item>
        <n-form-item label="文章内容">
          <RichTextEditor v-model="updateBlogTemp.content"></RichTextEditor>
        </n-form-item>
        <n-form-item label="">
          <n-button @click="updateBlog">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
  </n-tabs>
  <!-- {{ addBlogTemp.content }} -->
</template>

<script setup>
import { AdminStore } from "../../stores/AdminStores";
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import RichTextEditor from "../../components/RichTextEditor.vue";
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
const adminStore = AdminStore();

// 添加文章 临时数据
const addBlogTemp = reactive({
  tagId: "",
  title: "",
  content: "",
});

// 修改文章 临时数据
const updateBlogTemp = reactive({
  id: 0,
  tagId: "",
  title: "",
  content: "",
});

// 标签选项
const tagOptions = ref([]);
const blogListInfo = ref([]);
const tabValue = ref("list");

// 分页参数
const pageInfo = reactive({
  page: 1,
  pageSize: 4,
  count: 0,
  pageCount: 0,
});

onMounted(() => {
  loadBlogs();
  loadTags();
});

// 读取文章列表
const loadBlogs = async () => {
  let res = await axios.get(
    `/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`
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

  // console.log(res);
};

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

// 添加文章
const addBlog = async () => {
  let res = await axios.post("/blog/add", {
    title: addBlogTemp.title,
    tagId: addBlogTemp.tagId,
    content: addBlogTemp.content,
  });

  if (res.data.code == 200) {
    message.info(res.data.msg);
    // 添加成功后置空
    addBlogTemp.tagId = "";
    addBlogTemp.title = "";
    addBlogTemp.content = "";
  } else {
    message.error(res.data.msg);
  }
};

// 切换分页
const toPage = (pageNum) => {
  pageInfo.page = pageNum;
  loadBlogs();
};

// 传入并修改文章
const toUpdate = async (blog) => {
  let res = await axios.get("/blog/detail?id=" + blog.id);
  updateBlogTemp.id = blog.id;
  updateBlogTemp.title = res.data.results.title;
  updateBlogTemp.tagId = res.data.results.tag_id;
  updateBlogTemp.content = res.data.results.content;
  // 跳转修改页面 必须加载数据后再跳转 否则编辑器没有内容
  tabValue.value = "update";

  // console.log(res);
  // console.log(updateBlogTemp.content);
};

// 修改文章
const updateBlog = async () => {
  let res = await axios.put("/blog/update", updateBlogTemp);
  if (res.data.code == 200) {
    message.info(res.data.msg);
    loadBlogs();
    tabValue.value = "list";
  } else {
    message.error(res.data.msg);
  }

  console.log(res);
};

// 删除文章
const deleteBlog = async (blog) => {
  dialog.warning({
    title: "警告",
    content: "是否要删除",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      let res = await axios.delete("/blog/delete?id=" + blog.id);
      if (res.data.code == 200) {
        message.info(res.data.msg);
        loadBlogs();
      } else {
        message.error(res.data.msg);
      }
    },
    onNegativeClick: () => {},
  });
};

// export default {
//   name: "Blog.vue"
// }
</script>

<style scoped></style>
