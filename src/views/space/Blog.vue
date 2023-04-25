<template>
  <div class="main-container">
    <el-button @click="toAdd">添加文章</el-button>
    <div class="blog-list">
      <div v-for="(blog, index) in blogInfo">
        <el-card shadow="hover">
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
  </div>

  <!-- 编辑文章 -->
  <div class="edit-blog">
    <el-dialog
      v-model="dialogEditVisible"
      :title="dialogTitle"
      destroy-on-close
    >
      <el-form :model="blogTemp">
        <el-form-item label="标题">
          <el-input v-model="blogTemp.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="选择文章标签">
          <el-select v-model="blogTemp.tagId">
            <el-option
              v-for="item in tagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <RichTextEditor v-model="blogTemp.content"></RichTextEditor>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取消</el-button>
          <el-button
            v-if="dialogType == 'edit'"
            type="primary"
            @click="updateBlog"
            >修改</el-button
          >
          <el-button
            v-else-if="dialogType == 'add'"
            type="primary"
            @click="addBlog"
            >提交</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
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

const dialogTitle = ref("");
const dialogType = ref("");
const dialogEditVisible = ref(false);

// 文章临时数据
const blogTemp = reactive({
  id: 0,
  tagId: "",
  title: "",
  content: "",
});

// 标签页
const tagOptions = ref([]);
const blogInfo = ref({});

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
  // 准换标签数据格式
  tagOptions.value = res.results.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
};

// 打开添加弹窗
const toAdd = () => {
  dialogType.value = "add";
  blogTemp.tagId = "";
  blogTemp.title = "";
  blogTemp.content = "";
  dialogTitle.value = "添加文章";
  dialogEditVisible.value = true;
};

// 添加文章
const addBlog = async () => {
  let res = await api.blogAdd(blogTemp);
  if (res.code === 200) {
    ElMessage.success("添加成功");
    // 清空输入框
    blogTemp.tagId = "";
    blogTemp.title = "";
    blogTemp.content = "";
    loadBlogs();
    dialogEditVisible.value = false;
  } else {
    console.log(res);
    ElMessage.warning(res.msg);
  }
};

// 传入并修改文章
const toUpdate = async (blog) => {
  dialogType.value = "edit";
  let res = await api.blogDetail(blog.id);
  blogTemp.id = blog.id;
  blogTemp.title = res.results.title;
  blogTemp.tagId = res.results.tag_id;
  blogTemp.content = res.results.content;
  dialogEditVisible.value = true;
};

// 修改文章
const updateBlog = async () => {
  let res = await api.blogUpdate(blogTemp);
  if (res.code === 200) {
    ElMessage.success("修改成功");
    loadBlogs();
    dialogEditVisible.value = false;
  } else {
    ElMessage.warning("修改失败");
  }
};

// 删除文章
const deleteBlog = async (blog) => {
  let res = await api.deleteBlog(blog.id);
  if (res.code === 200) {
    ElMessage.success("删除成功");
    loadBlogs();
  } else {
    ElMessage.warning(res.msg);
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100%;
  .blog-list {
    display: flex;
    flex-direction: column;
    .el-card {
      margin-bottom: 10px;
      width: 900px;
      height: 100px;
      border-radius: 10px;
      .header {
        font-size: 18px;
      }
    }
  }
}
</style>
