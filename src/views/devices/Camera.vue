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
        <div class="favorite" @click="favorite">
          <el-icon v-if="favoriteId === ''" :size="20">
            <Star />
          </el-icon>
          <el-icon v-else :size="20">
            <StarFilled />
          </el-icon>
        </div>
      </el-col>
    </el-row>
    <div class="device-info">
      <el-descriptions title="详细参数" border size="small">
        <el-descriptions-item label="卡口">{{ cameraInfo.mount }}</el-descriptions-item>
        <el-descriptions-item label="传感器尺寸">{{ cameraInfo.frame }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ cameraInfo.type }}</el-descriptions-item>
        <el-descriptions-item label="像素(万)">{{ cameraInfo.w_pixel }}</el-descriptions-item>
        <el-descriptions-item label="重量(g)">{{ cameraInfo.weight }}</el-descriptions-item>
        <el-descriptions-item label="存储卡数量">{{ cameraInfo.card_slot }}</el-descriptions-item>
        <el-descriptions-item label="对焦方式">{{ cameraInfo.focus }}</el-descriptions-item>
        <el-descriptions-item label="对焦点">{{ cameraInfo.focal_point }}</el-descriptions-item>
        <el-descriptions-item label="眼部识别对焦">{{ cameraInfo.eye_focus }}</el-descriptions-item>
        <el-descriptions-item label="取景器">{{ cameraInfo.viewfinder }}</el-descriptions-item>
        <el-descriptions-item label="防抖">{{ cameraInfo.ois }}</el-descriptions-item>
        <el-descriptions-item label="感光度">{{ cameraInfo.iso }}</el-descriptions-item>
        <el-descriptions-item label="双原生ISO">{{ cameraInfo.dual_iso }}</el-descriptions-item>
        <el-descriptions-item label="处理器">{{ cameraInfo.processor }}</el-descriptions-item>
        <el-descriptions-item label="最高连拍速度">{{ cameraInfo.shoot_speed }}</el-descriptions-item>
        <el-descriptions-item label="最高视频规格">{{ cameraInfo.video }}</el-descriptions-item>
        <el-descriptions-item label="视频色深">{{ cameraInfo.video_color_depth }}</el-descriptions-item>
        <el-descriptions-item label="色度采样">{{ cameraInfo.yuv }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ cameraInfo.other }}</el-descriptions-item>
      </el-descriptions>
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
import { Star, StarFilled } from "@element-plus/icons-vue";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

let cameraInfo = ref({});
let commentsInfo = ref([]);
const textarea = ref("");
const favoriteId = ref("");

onMounted(() => {
  loadCamera();
  laodComments();
  loadFavorite();
});

// 加载相机数据
const loadCamera = async () => {
  let res = await api.cameraDetail(route.query.id);
  // 布尔值转换为具体名称
  res.results.frame = res.results.frame == "FX" ? "全画幅" : "半画幅";
  res.results.dual_iso = res.results.dual_iso == 1 ? "支持" : "不支持";
  res.results.eye_focus = res.results.eye_focus == 1 ? "支持" : "不支持";
  res.results.type = res.results.type == 1 ? "单反" : "无反";
  cameraInfo.value = res.results;
};

// 加载收藏状态
const loadFavorite = async () => {
  let res = await api.favoriteList({
    kind: "camera",
    id: route.query.id,
  });

  // 寻找收藏条目
  let index = res.data.rows.findIndex(
    (item) => item.camera_id == route.query.id
  );

  if (index != -1) {
    favoriteId.value = res.data.rows[index].id;
  }
  console.log(favoriteId.value);
};

// 修改收藏状态
const favorite = async () => {
  if (favoriteId.value == "") {
    // 添加
    let res = await api.favoriteAdd({
      kind: "camera",
      objectId: route.query.id,
    });
    console.log(res);
    favoriteId.value = res.id;
    console.log(favoriteId.value);
  } else {
    // 取消
    let res = await api.favoriteDelete(favoriteId.value);
    favoriteId.value = "";
    console.log(res);
    console.log(favoriteId.value);
  }
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
  width: 1200px;
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
  }
}
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
