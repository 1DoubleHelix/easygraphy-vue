<template>
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

  <div class="comment"></div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";

moment.locale("zh-cn", momentCN);

const axios = inject("axios");

const router = useRouter();
const route = useRoute();

let cameraInfo = ref({});

onMounted(() => {
  loadCamera();
});

// 加载相机数据
const loadCamera = async () => {
  let res = await axios.get("/camera/detail?id=" + route.query.id);
  cameraInfo.value = res.data.results;
};
</script>

<style lang="scss" scoped>
.camera-info {
  margin-top: 30px;
  //background-color: #bfa;

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
.comment {
  margin-top: 20px;
  background-color: #cccccc;
  height: 300px;
}
</style>
