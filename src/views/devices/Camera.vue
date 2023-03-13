<template>
  <!-- 展示区 -->
  <div class="camera-info">
    <el-row>
      <el-col :span="8">
        <div class="device-logo">
          <img :src="`/src/assets/logo/${cameraInfo.brand}.svg`" alt="Logo" />
        </div>
      </el-col>
      <el-col :span="16">
        <div class="device-main">
          <div class="name">{{ cameraInfo.name }}</div>
          发布年份:{{ cameraInfo.release_year }}
          <br />
          分数:{{ cameraInfo.score }}
        </div>
      </el-col>
    </el-row>
    <div class="device-info">
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="info-card">画幅{{ cameraInfo.frame }}</div>
        </el-col>
        <el-col :span="12"> <div class="info-card"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8"><div class="info-card"></div></el-col>
        <el-col :span="8"><div class="info-card"></div></el-col>
        <el-col :span="8"><div class="info-card"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8"><div class="info-card"></div></el-col>
        <el-col :span="8"><div class="info-card"></div></el-col>
        <el-col :span="8"><div class="info-card"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8"><div class="info-card"></div></el-col>
        <el-col :span="8"><div class="info-card"></div></el-col>
        <el-col :span="8"><div class="info-card"></div></el-col>
      </el-row>
    </div>
  </div>
  <!-- 评论区 -->
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
    <!-- 全部评论 -->
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
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import request from "../../utils/request";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

let cameraInfo = ref({});
let commentsInfo = ref([]);
const textarea = ref("");

onMounted(() => {
  loadCamera();
  laodComments();
});

// 加载相机数据
const loadCamera = async () => {
  let res = await api.cameraDetail(route.query.id);
  cameraInfo.value = res.results;
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
.camera-info {
  margin: auto;
  margin-top: 30px;
  width: 1000px;
  .device-logo {
    width: 300px;
    height: 300px;
    background: #f5f5f5;

    img {
      width: 270px;
      height: 270px;
      display: block;
      padding: 15px;
      margin: 0 auto;
    }
  }

  .device-main {
    margin: auto;
    text-align: center;

    .name {
      font-family: arial, sans-serif;
      font-size: 30px;
      font-weight: bold;
    }
  }

  .device-info {
    margin-top: 20px;
    padding: 0 5px;
    .el-row {
      margin-bottom: 10px;
    }
    .info-card {
      height: 40px;
      border-radius: 6px;
      background: #f6f6f6;

      font-size: 18px;
      text-align: center;
    }
  }
}
.comment-area {
  width: 1000px;
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
