<template>
  <div class="main-container">
    <n-tabs v-model:value="activeTab" type="line" animated>
      <n-tab-pane tab="我的文章" name="blogList">
        <div class="blog-list">
          <div v-for="(blog, index) in blogInfo">
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
        </div>
      </n-tab-pane>
      <n-tab-pane tab="编写文章" name="blogEdit">
        <el-form>
          <el-form-item label="标题">
            <el-input v-model="addBlogTemp.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="选择文章标签">
            <el-select v-model="addBlogTemp.tagId" placeholder="请选择">
              <el-option
                v-for="item in tagOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文章内容">
            <RichTextEditor v-model="addBlogTemp.content"></RichTextEditor>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="addBlog">提交</el-button>
          </el-form-item>
        </el-form>
      </n-tab-pane>
      <n-tab-pane tab="修改文章" name="blogUpdate">
        <el-form>
          <el-form-item label="标题">
            <el-input v-model="updateBlogTemp.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="选择文章标签">
            <el-select v-model="updateBlogTemp.tagId" placeholder="请选择">
              <el-option
                v-for="item in tagOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文章内容">
            <RichTextEditor v-model="updateBlogTemp.content"></RichTextEditor>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="updateBlog">提交修改</el-button>
          </el-form-item>
        </el-form>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import RichTextEditor from "../../components/RichTextEditor.vue";
import * as api from "../../api/index.js";
import { userStore } from "../../stores/userStore.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import { ElMessage } from "element-plus";
const store = userStore();

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

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

// 标签页
const tagOptions = ref([]);
const blogInfo = ref({});
const activeTab = ref("blogList");

// 分页参数
const blogPageInfo = reactive({
  page: 1,
  pageSize: 4,
  count: 0,
});

onMounted(() => {
  loadBlogs();
  loadTagOptions();
});

// 加载文章
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
};

// 加载标签选项
const loadTagOptions = async () => {
  let res = await api.tagList();
  let rows = res.results;
  // 准换标签数据格式
  tagOptions.value = res.results.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
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
  activeTab.value = "blogUpdate";
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
  let res = await api.deleteBlog(blog.id);
  if (res.code === 200) {
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
