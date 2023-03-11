<template>
  <div class="try">演练场，射就完了</div>
  <div class="test">
    <p>试试新axios</p>
    <div>
      <el-button @click="testAxios">发发发！</el-button>
    </div>

    <div class="slider-demo-block">
      <el-slider v-model="slider" range show-stops :max="100" />
    </div>
    <el-select clearable placeholder="请选择">
      <el-option label="Zone one" value="shanghai" />
      <el-option label="Zone two" value="beijing" />
    </el-select>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { userStore } from "../stores/userStore.js";
import * as api from "../api/index.js";

const router = useRouter();
const route = useRoute();
const store = userStore();
const axios = inject("axios");

const slider = ref([0, 5000]);

onMounted(() => {
  console.log(store.token);
  console.log(localStorage.getItem("token"));
});

const testAxios = () => {
  let res = api.test();
  console.log(res);
};
</script>

<style lang="scss" scoped>
.try {
  margin: 0 auto;
  text-align: center;
}

.test {
  margin: 0 auto;
  width: 800px;
  background-color: #eeeeee;
}
</style>
