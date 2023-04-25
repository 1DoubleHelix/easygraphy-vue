<template>
  <div class="main-container">
    <!-- 展示区 -->
    <div class="combine-info" v-if="combineInfo">
      <el-row>
        <el-col :span="7" class="camera">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>相机</span>
              </div>
            </template>
            <div>
              <el-image
                class="logo"
                :src="`/src/assets/logo/${combineInfo.camera.brand}.png`"
                fit="cover"
              />
              <div class="name">
                {{ combineInfo.camera.brand + " " + combineInfo.camera.name }}
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="17" class="lens">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>镜头</span>
              </div>
            </template>
            <div
              v-for="(lens, index) in combineInfo.lensGroup"
              :key="index"
              class="item"
            >
              <span>
                <el-image
                  class="logo"
                  :src="`/src/assets/logo/${lens.brand}.png`"
                  fit="cover"
                />
              </span>
              <span class="name">
                {{ lens.brand + " " + lens.name }}
              </span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div v-if="token" class="favorite" @click="favorite">
        <el-button v-if="favoriteId === ''"> 收藏 </el-button>
        <el-button v-else> 取消收藏 </el-button>
      </div>
      <div class="title">{{ combineInfo.combine.title }}</div>
      <div class="content">{{ combineInfo.combine.content }}</div>
    </div>
    <!-- 评论区 -->
    <div class="comment-area">
      <Comment type="combine" :id="route.query.id" />
    </div>
  </div>
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

let combineInfo = ref({
  combine: {},
  camera: {},
  lens: [],
});
let commentsInfo = ref([]);
const textarea = ref("");
const favoriteId = ref("");

onMounted(() => {
  loadCombine();
  loadFavorite();
});

// 加载组合数据
const loadCombine = async () => {
  let res = await api.detailCombine(route.query.id);
  combineInfo.value = res;
  console.log(combineInfo.value);
};

// 加载收藏状态
const loadFavorite = async () => {
  let res = await api.favoriteList({
    kind: "combine",
    id: route.query.id,
  });
  // 寻找收藏条目
  let index = res.data.rows.findIndex(
    (item) => item.combine_id == route.query.id
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
      kind: "combine",
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
.main-container {
  .combine-info {
    margin: auto;
    margin-top: 30px;
    width: 1200px;
    .camera {
      .el-card {
        margin-right: 5px;
        height: 370px;
        .logo {
          display: block;
          height: 200px;
          width: 200px;
          margin: auto;
        }
        .name {
          margin-top: 10px;
          font-size: 25px;
          color: #666;
          text-align: center;
        }
        .el-button {
          width: 300px;
          margin: 10px auto;
          display: block;
        }
      }
    }
    .lens {
      .el-card {
        margin-left: 5px;
        height: 370px;
        .item {
          display: flex;
          margin-top: 5px;
          align-items: center;
          .logo {
            padding: 2px;
            border-radius: 3px;
            border: #dcdfe6 solid 1px;
            height: 40px;
          }
          .name {
            margin-left: 10px;
            font-size: 20px;
            color: #333;
          }
          .el-button {
            width: 80px;
            margin-left: auto;
          }
        }
      }
    }
    .title {
      margin-top: 20px;
      font-size: 30px;
      color: #333;
    }
    .content {
      margin-top: 10px;
      font-size: 20px;
      color: #666;
    }
  }
}
</style>
