<template>
  <div class="main-container">
    <!-- 展示区 -->
    <div class="combine-info" v-if="combineInfo">
      <div class="title">{{ combineInfo.combine.title }}</div>
      <el-row>
        <el-col :span="8">
          <div class="device-logo">
            <img
              :src="`/src/assets/logo/${combineInfo.camera.brand}.svg`"
              alt="Logo"
            />
          </div>
        </el-col>
        <el-col :span="16">
          <div class="lens">
            <div v-for="(lens, index) in combineInfo.lensGroup">
              {{ lens.name }}
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="content">{{ combineInfo.combine.content }}</div>
    </div>
    <!-- 评论区 -->
    <div class="comment-area">
      <!-- 添加评论 -->
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
              <el-avatar shape="square" :size="60" :fit="fit" :src="url" />
            </el-col>
            <el-col :span="22">
              <el-card shadow="hover"> {{ comment.content }}</el-card>
            </el-col>
          </el-row>
        </div>
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

let combineInfo = ref({
  combine: {},
  camera: {},
  lens: [],
});
let commentsInfo = ref([]);
const textarea = ref("");

onMounted(() => {
  loadCombine();
  laodComments();
});

// 加载组合数据
const loadCombine = async () => {
  let res = await api.detailCombine(route.query.id);
  combineInfo.value = res;
  console.log(combineInfo.value);
};

// 加载评论区
const laodComments = async () => {
  let res = await api.searchComment({
    kind: "combine",
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
    kind: "combine",
    objectId: route.query.id,
    content: textarea.value,
  });
  textarea.value = "";
  laodComments();
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 1000px;
  margin: auto;

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

  .lens {
    margin: auto;
    text-align: center;

    .name {
      font-family: arial, sans-serif;
      font-size: 30px;
      font-weight: bold;
    }
  }
}
</style>
