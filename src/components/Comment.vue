<template>
  <div class="comment-area">
    <div class="add-comment">
      <el-row>
        <el-col :span="20">
          <el-input
            v-model="textarea"
            :rows="2"
            resize="none"
            maxlength="150"
            type="textarea"
            show-word-limit
            placeholder="正在安装镜头..."
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
  <div>
    {{ textarea }}
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../api/index.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../utils/monentCN";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

const textarea = ref("");
let commentsInfo = ref([]);
const props = defineProps({
  type: String,
  id: String,
});

onMounted(() => {
  laodComments();
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
    background-color: blanchedalmond;
  }

  .comments {
    .comment {
      margin-top: 20px;
    }
  }
}
</style>
