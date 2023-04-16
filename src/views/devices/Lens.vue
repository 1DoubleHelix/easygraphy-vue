<template>
  <!-- 展示区 -->
  <div class="lens-info">
    <el-row>
      <el-col :span="7">
        <div class="device-logo">
          <el-image
            fit="cover"
            :src="`/src/assets/logo/${lensInfo.brand}.png`"
          />
        </div>
      </el-col>
      <el-col :span="17">
        <div class="device-main">
          <div class="name">{{ lensInfo.name }}</div>
          <span class="year"> 发布年份:{{ lensInfo.release_year }} </span>
          <div v-if="token" class="favorite" @click="favorite">
            <el-button v-if="favoriteId === ''" :size="20"> 收藏 </el-button>
            <el-button v-else :size="20"> 取消收藏 </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-card shadow="none" class="device-info">
      <el-descriptions title="详细参数" border size="small">
        <el-descriptions-item label="支持卡口">{{ lensInfo.mount }}</el-descriptions-item>
        <el-descriptions-item label="传感器尺寸">{{ lensInfo.frame }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ lensInfo.zoom }}</el-descriptions-item>
        <el-descriptions-item label="重量(g)">{{ lensInfo.weight }}</el-descriptions-item>
        <el-descriptions-item label="最大光圈">{{ lensInfo.max_aperture }}</el-descriptions-item>
        <el-descriptions-item label="滤镜尺寸">{{ lensInfo.filter_size }}</el-descriptions-item>
        <el-descriptions-item label="等效焦段(mm)">{{ lensInfo.equivalent_focal }}</el-descriptions-item>
        <el-descriptions-item label="最近对焦距离(mm)">{{ lensInfo.min_focus_distance }}</el-descriptions-item>
        <el-descriptions-item label="防抖">{{ lensInfo.ois }}</el-descriptions-item>
        <el-descriptions-item label="放大倍率">{{ lensInfo.magnification }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ lensInfo.other }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
  <!-- 评论区 -->
  <div class="comment-area">
    <Comment type="lens" :id="route.query.id" />
  </div>
  <div class="bg"></div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";
import { Star, StarFilled } from "@element-plus/icons-vue";
import Comment from "../../components/Comment.vue";
import { userStore } from "../../stores/userStore.js";
import { storeToRefs } from "pinia";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

const store = userStore();
let { token } = storeToRefs(store);

let lensInfo = ref({});
let commentsInfo = ref([]);
const textarea = ref("");
const favoriteId = ref("");

onMounted(() => {
  loadLens();
  loadFavorite();
});

// 加载镜头数据
const loadLens = async () => {
  let res = await api.lensDetail(route.query.id);
  // 布尔值转换为具体名称
  res.results.frame = res.results.frame == "FX" ? "全画幅" : "半画幅";
  res.results.ois = res.results.ois == 1 ? "支持" : "不支持";
  res.results.zoom = res.results.zoom == 1 ? "变焦" : "定焦";
  res.results.type = res.results.type == 1 ? "单反" : "无反";
  lensInfo.value = res.results;
};

// 加载收藏状态
const loadFavorite = async () => {
  let res = await api.favoriteList({
    kind: "lens",
    id: route.query.id,
  });

  // 寻找收藏条目
  let index = res.data.rows.findIndex((item) => item.lens_id == route.query.id);

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
      kind: "lens",
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
.lens-info {
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
