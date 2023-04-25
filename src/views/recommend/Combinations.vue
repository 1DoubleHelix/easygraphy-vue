<template>
  <div class="main-container">
    <div class="list">
      <el-card
        v-for="combine in combineInfo"
        :key="combine.id"
        @click="toDetail(combine.id)"
        shadow="hover"
      >
        <template #header>
          <div class="header">
            <div class="title">{{ combine.title }}</div>
            <div class="author">
              <span>{{ combine.nickname }}</span>
              <el-avatar
                :src="avatarUrl + combine.user_id + '.jpg'"
                :size="28"
              ></el-avatar>
            </div>
          </div>
        </template>
        <div class="combine-info">
          <el-image
            class="logo"
            :src="`/src/assets/logo/${combine.brand}.png`"
            fit="cover"
          />
          <div class="info">
            <span class="camera">{{ combine.name }}</span>
            <span class="content">{{ combine.content }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
  <div class="bg"></div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import { ElMessage } from "element-plus";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

// 筛选的参数 待添加
const combineFilter = reactive({
  keyword: "",
});
const combineInfo = ref([]);
const combinePageInfo = reactive({
  page: 1,
  pageSize: 10,
  count: 0,
});
const avatarUrl = ref("http://localhost:8088/images/avatar/");

onMounted(() => {
  loadCombine();
});

const toDetail = (id) => {
  router.push({ path: "/recommend/detail", query: { id } });
};

const loadCombine = async () => {
  let res = await api.searchCombine({
    keyword: combineFilter.keyword,
    page: combinePageInfo.page,
    pageSize: combinePageInfo.pageSize,
  });

  console.log(res);

  combineInfo.value = res.data.rows;
  combinePageInfo.count = res.data.count;
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 1000px;
  margin: auto;
  .list {
    .el-card {
      margin-top: 15px;
      cursor: pointer;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 20px;
        .author {
          display: flex;
          align-items: center;
          span {
            margin-right: 10px;
          }
        }
        .title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }
      }
      .combine-info {
        display: flex;
        align-items: center;
        .logo {
          height: 60px;
        }
        .info {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          .camera {
            font-size: 15px;
            font-weight: bold;
            color: #444;
          }
          .content {
            font-size: 14px;
            color: #666;
          }
        }
      }
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
