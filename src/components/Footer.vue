<template>
  <div class="footer">
    <el-row>
      <el-col :span="8" class="left">
        <el-image src="/src/assets/logo.svg" class="logo" />
        <div class="text">挑选设备, 开始摄影之旅</div>
      </el-col>
      <el-col :span="16" class="right">
        <div class="link">
          <div class="title">友情链接</div>
          <el-link :underline="false" href="https://element-plus.org"
            >Element-plus</el-link
          >
          <el-link
            :underline="false"
            href="https://space.bilibili.com/522014356"
            >行星推进器</el-link
          >
          <el-link :underline="false" href="https://unsplash.com"
            >Unsplash</el-link
          >
          <el-link :underline="false" href="https://www.dxomark.com/"
            >DXOMARK</el-link
          >
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid #dcdfe6;
  background-color: #fff;
  height: 250px;
  .left {
    padding: 20px;
    .logo {
      width: 200px;
    }
    .text {
      margin-left: 20px;
    }
  }
  .right {
    padding: 20px;
    .link {
      .title {
        font-size: 20px;
        font-weight: 600;
      }
      .el-link {
        margin-top: 10px;
        display: block;
      }
    }
  }
}
</style>
