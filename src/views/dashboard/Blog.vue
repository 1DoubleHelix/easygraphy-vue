<template>
  <div class="main-container">
    <el-button @click="toAdd">添加文章</el-button>
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
import { ElMessage } from "element-plus";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";

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

// 标签选项
const tagOptions = ref([]);
const blogListInfo = ref([]);

// 分页参数
const pageInfo = reactive({
  page: 1,
  pageSize: 6,
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
};

// 打开添加弹窗
const toAdd = () => {
  blogTemp.tagId = "";
  blogTemp.title = "";
  blogTemp.content = "";
  dialogTitle.value = "添加文章";
  dialogType.value = "add";
  dialogEditVisible.value = true;
};

// 添加文章
const addBlog = async () => {
  let res = await api.blogAdd(blogTemp);
  if (res.code === 200) {
    ElMessage.success("添加成功");
    loadBlogs();
    dialogEditVisible.value = false;
  } else {
    ElMessage.warning(res.msg);
  }
};

// 打开修改文章弹窗
const toUpdate = async (blog) => {
  let res = await api.blogDetail(blog.id);
  blogTemp.id = res.results.id;
  blogTemp.tagId = res.results.tag_id;
  blogTemp.title = res.results.title;
  blogTemp.content = res.results.content;
  dialogTitle.value = "修改文章";
  dialogType.value = "edit";
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
    ElMessage.warning(res.msg);
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

<style scoped>
.main-container {
  padding: 10px;
}
.edit-blog {
  width: 1200px;
}
</style>
