<template>
  <n-tabs v-model:value="tabValue" type="line" animated>
    <n-tab-pane name="list" tab="文章列表">
      <div v-for="(blog, index) in blogListInfo" style="margin-bottom: 15px">
        <el-card>
          <div class="header">
            <span>{{ blog.title }}</span>
            <el-button @click="toUpdate(blog)">修改</el-button>
            <el-popconfirm
              title="确认删除?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="deleteBlog(blog)"
            >
              <template #reference>
                <el-button>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
          <div>{{ blog.content }}</div>
          <div>{{ blog.create_time }}</div>
        </el-card>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageInfo.count"
        :page-size="pageInfo.pageSize"
        v-model:current-page="pageInfo.page"
        @update:current-page="loadBlogs"
      />
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
      {{ addBlogTemp.content }}
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
      {{ updateBlogTemp.content }}
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import RichTextEditor from "../../components/RichTextEditor.vue";
import * as api from "../../api/index.js";

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
  let res = await api.searchBlog({
    page: pageInfo.page,
    pageSize: pageInfo.pageSize,
  });

  console.log(res);

  let rows = res.data.rows;
  for (let row of rows) {
    // 内容已裁剪至50个字符 这里追加省略号
    row.content += " ...";
    // 时间戳格式化
    row.create_time = moment(row.create_time).format("lll");
  }
  blogListInfo.value = rows;

  // 算总页码
  pageInfo.count = res.data.count;
  pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);

  // console.log(res);
};

// 加载标签数据
const loadTags = async () => {
  let res = await api.tagList();
  // 转换data到选项格式
  tagOptions.value = res.results.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  // console.log(tagOptions.value);
};

// 添加文章
const addBlog = async () => {
  let res = await api.blogAdd(addBlogTemp);
  if (res.code === 200) {
    ElMessage({ message: "添加成功", type: "success" });
    // 清空输入框
    addBlogTemp.tagId = "";
    addBlogTemp.title = "";
    addBlogTemp.content = "";
    loadBlogs();
    activeTab.value = "blogList";
  } else {
    ElMessage({ message: res.msg, type: "warning" });
  }
};

// 传入并修改文章
const toUpdate = async (blog) => {
  let res = await api.blogDetail(blog.id);
  updateBlogTemp.id = blog.id;
  updateBlogTemp.title = res.results.title;
  updateBlogTemp.tagId = res.results.tag_id;
  updateBlogTemp.content = res.results.content;
  tabValue.value = "update";
};

// 修改文章
const updateBlog = async () => {
  let res = await api.blogUpdate(updateBlogTemp);
  if (res.code === 200) {
    ElMessage({ message: "修改成功", type: "success" });
    loadBlogs();
    activeTab.value = "blogList";
  } else {
    ElMessage({ message: res.msg, type: "warning" });
  }
};

// 删除文章
const deleteBlog = async (blog) => {
  // 这里没有token 无法完成删除 需要token
  let res = await api.deleteBlog(blog.id);
  if (res.code === 200) {
    loadBlogs();
  }
};
</script>

<style scoped></style>
