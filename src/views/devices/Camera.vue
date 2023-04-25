<template>
  <!-- 展示区 -->
  <div class="camera-info">
    <el-row>
      <el-col :span="7">
        <div class="device-logo">
          <el-image
            fit="cover"
            :src="`/src/assets/logo/${cameraInfo.brand}.png`"
          />
        </div>
      </el-col>
      <el-col :span="17">
        <div class="device-main">
          <div class="name">{{ cameraInfo.name }}</div>
          <span class="score"> 分数:{{ cameraInfo.score }} </span>
          <span class="year"> 发布年份:{{ cameraInfo.release_year }} </span>
          <div v-if="token" class="favorite" @click="favorite">
            <el-button v-if="favoriteId === ''" :size="20"> 收藏 </el-button>
            <el-button v-else :size="20"> 取消收藏 </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-card class="device-info" shadow="none">
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
    </el-card>
  </div>
  <!-- 评论区 -->
  <div class="comment-area">
    <Comment type="camera" :id="route.query.id" />
  </div>
  <div class="bg"></div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";
import { userStore } from "../../stores/userStore.js";
import { storeToRefs } from "pinia";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import Comment from "../../components/Comment.vue";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

const store = userStore();
let { token } = storeToRefs(store);

let cameraInfo = ref({});
const textarea = ref("");
const favoriteId = ref("");

onMounted(() => {
  loadCamera();
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
</script>

<style lang="scss" scoped>
.camera-info {
  margin: auto;
  margin-top: 30px;
  width: 1200px;
  .device-logo {
    width: 300px;
    height: 300px;
    background-color: #fff;
    .el-image {
      width: 270px;
      height: 270px;
      margin: 15px;
    }
  }
  .device-main {
    display: flex;
    text-align: center;
    flex-direction: column;
    margin: auto;
    .name {
      margin-top: 30px;
      font-family: arial, sans-serif;
      font-size: 50px;
      color: #333;
      font-weight: bold;
    }
    .score {
      margin-top: 10px;
      font-size: 30px;
      color: #333;
      font-weight: bold;
    }
    .year {
      margin-top: 10px;
      font-size: 20px;
      color: #333;
      font-weight: bold;
    }
    .favorite {
      margin-top: 50px;
      .el-button {
        width: 100px;
      }
    }
  }
  .device-info {
    margin-top: 20px;
    .title {
      margin-top: 30px;
      font-size: 15px;
      color: #333;
      font-weight: bold;
    }
  }
}
.bg {
  position: fixed;
  top: 0;
  z-index: -1;
  height: 100vh;
  width: 100vw;
  background-color: #f2f3f5;
  // background-image: url("@/assets/picture/12.jpg");
  // background-size: cover;
}
</style>
