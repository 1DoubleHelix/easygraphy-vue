<template>
  <div class="main-container">
    {{ blogInfo.title }}

    <div v-html="blogInfo.content"></div>

    <div class="comment-area">
      <div class="add-comment">
        <el-row>
          <el-col :span="20">
            <el-input
              v-model="textarea"
              :rows="3"
              resize="none"
              maxlength="150"
              type="textarea"
              show-word-limit
              placeholder="正在安装镜头... ..."
            />
          </el-col>
          <el-col :span="4">
            <el-button @click="addComment" plain>发表评论</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="comments">
        <div v-for="(comment, index) in commentsInfo" class="comment">
          <el-row>
            <el-col :span="2">
              <el-avatar
                shape="square"
                :size="60"
                fit="cover"
                src="../../assets/avatar/default.jpeg"
              />
            </el-col>
            <el-col :span="22">
              <el-card shadow="hover"> {{ comment.content }} </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
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

const blogInfo = ref({});
let commentsInfo = ref([]);
const textarea = ref("");

onMounted(() => {
  loadBlogs();
  laodComments();
});

const loadBlogs = async () => {
  let res = await api.blogDetail(route.query.id);
  console.log(res);
  blogInfo.value = res.results;
};

// 加载评论区
const laodComments = async () => {
  let res = await api.searchComment({
    kind: "camera",
    id: route.query.id,
  });

  // 时间戳格式化
  let comments = res.data.rows;
  for (let comment of comments) {
    comment.create_time = moment(comment.create_time).format("lll");
  }
  commentsInfo.value = comments;
};

// 添加评论
const addComment = async () => {
  let res = await api.addComment({
    kind: "camera",
    objectId: route.query.id,
    content: textarea.value,
  });
  textarea.value = "";
  laodComments();
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 1200px;
  margin: auto;
}
</style>
