<template>
  <div class="main-container">
    <div class="wrapper"></div>
    <el-row>
      <div class="title-pic">
        <div class="title">
          <h3>交流知识</h3>
          <p>阅读官方教程、发表文章和评论，一起互动！</p>
        </div>
        <div class="pic pic1" />
      </div>
      <div class="title-pic">
        <div class="pic pic2" />
        <div class="title">
          <h3>设备数据库</h3>
          <p>
            精简，但不简单，包含主流性能的摄影设备数据库，轻松找到想要的设备
          </p>
        </div>
      </div>
      <div class="title-pic">
        <div class="title">
          <h3>设备挑选助手</h3>
          <p>没有经验？试试设备挑选助手，一定能找到心仪的组合</p>
        </div>
        <div class="pic pic3" />
      </div>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
// 自定义组件
import { useRouter, useRoute } from "vue-router";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

// 使用Naive的独立API 提示信息组件
const message = inject("message");
const dialog = inject("dialog");

const axios = inject("axios");

onMounted(() => {});
</script>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  .wrapper {
    height: 700px;
    width: 100%;
    background-image: url("@/assets/picture/08.jpg");
    background-size: cover;
  }
  .el-row {
    height: 700px;
    width: 100%;
    .title-pic {
      display: flex;
      width: 100%;
      height: 100%;
      .title {
        flex: 1;
        padding: 80px 150px;
        h3 {
          font-size: 3vw;
          font-weight: 500;
        }
        p {
          font-size: 1.5vw;
          font-weight: 400;
        }
      }
      .pic {
        height: 100%;
        width: 753px;
        background-size: contain;
        background-repeat: no-repeat;
      }
      .pic1 {
        background-image: url("@/assets/picture/05.jpg");
      }
      .pic2 {
        background-image: url("@/assets/picture/09.jpg");
      }
      .pic3 {
        background-image: url("@/assets/picture/10.jpg");
      }
    }
  }
}
</style>
