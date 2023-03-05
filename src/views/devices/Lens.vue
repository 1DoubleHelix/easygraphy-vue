<template>
  <div>
    <el-table :data="lensInfo" stripe border style="width: 100%">
      <el-table-column prop="brand" label="品牌" />
      <el-table-column prop="name" label="型号" />
      <el-table-column prop="mount" label="卡口" />
      <el-table-column prop="frame" label="画幅" />
      <el-table-column prop="min_focal" label="焦段" />
      <el-table-column prop="max_aperture" label="最大光圈" />
      <el-table-column prop="price" label="参考价格(元)" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
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

const lensInfo = ref([]);

onMounted(() => {
  loadLens();
});

const loadLens = async () => {
  let keyword = "";

  let res = await axios.get(`/lens/search?keyword=${keyword}`);
  console.log(res);

  let datas = res.data.results;
  // 汉化品牌
  for (let data of datas) {
    switch (data.brand) {
      case "Sony":
        data.brand = "索尼";
        break;
      case "Panasonic":
        data.brand = "松下";
        break;
      case "Nikon":
        data.brand = "尼康";
        break;
      case "Canon":
        data.brand = "佳能";
        break;
      case "Fuji":
        data.brand = "富士";
        break;
      case "Pentax":
        data.brand = "宾得";
        break;
    }

    // 处理焦段信息
    if (data.max_focal != null) {
      data.min_focal += " - ";
      data.min_focal += data.max_focal;
    }
  }
  lensInfo.value = datas;
};
</script>

<style lang="scss" scoped></style>
