<template>
  <div class="comment-area">
    <el-card shadow="never">
      <!-- 发表评论 未登录时不渲染 -->
      <div class="add-comment">
        <span>
          <el-image class="avatar" :src="avatarUrl" fit="cover" />
        </span>
        <el-input
          v-model="textarea"
          :rows="2"
          resize="none"
          maxlength="150"
          type="textarea"
          show-word-limit
          placeholder="正在安装镜头..."
        />
        <el-button @click="addComment" plain>发表评论</el-button>
      </div>
      <!-- 展示评论 -->
      <div class="comments">
        <span>全部评论</span>
        <div v-for="(comment, index) in commentsInfo" class="comment">
          <el-image
            class="avatar"
            :src="`http://localhost:8088/images/avatar/${comment.user_id}.jpg`"
            alt="Logo"
          >
            <template #error>
              <div class="image-slot">加载失败时显示</div>
            </template>
          </el-image>
          <span class="content"> {{ comment.content }} </span>
          <el-tag>{{ comment.create_time }}</el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../api/index.js";
import { userStore } from "../stores/userStore.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../utils/monentCN";
const store = userStore();

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

const avatarUrl = ref("");
const textarea = ref("");
let commentsInfo = ref([]);
const props = defineProps({
  type: String,
  id: String,
});

onMounted(() => {
  laodComments();
  avatarUrl.value = "http://localhost:8088/images/avatar/" + store.id + ".jpg";
});

// 加载评论
const laodComments = async () => {
  let res = await api.searchComment({
    // 评论的对象的类型
    type: props.type,
    // 对象的 id
    id: props.id,
  });

  // 时间戳格式化
  let comments = res.data.rows;
  for (let comment of comments) {
    comment.create_time = moment(comment.create_time).format("lll");
  }
  commentsInfo.value = comments;
  console.log(commentsInfo.value);
};

// 添加评论
const addComment = async () => {
  let res = await api.addComment({
    type: props.type,
    objectId: route.query.id,
    content: textarea.value,
  });
  console.log(res);
  textarea.value = "";
  laodComments();
};
</script>

<style lang="scss" scoped>
.comment-area {
  width: 1200px;
  margin: auto;
  margin-top: 20px;
  background-color: #bfa;
  .add-comment {
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 10px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .el-input {
      flex: 1;
    }
    .el-button {
      margin-left: 10px;
      height: 52px;
    }
  }
  .comments {
    margin-top: 30px;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
    .comment {
      display: flex;
      margin-top: 30px;
      align-items: center;
      border: 1px solid #f2f3f5;
      border-radius: 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .content {
        font-size: 15px;
        margin-left: 10px;
      }
      .el-tag {
        width: 150px;
        margin-left: auto;
        margin-right: 30px;
      }
    }
  }
}
</style>
