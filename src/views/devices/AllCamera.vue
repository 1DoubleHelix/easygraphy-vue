<template>
  <div>
    <el-table :data="cameraInfo" stripe border height="500" style="width: 100%">
      <el-table-column prop="brand" label="品牌" />
      <el-table-column label="型号">
        <!--自定义列模板 实现跳转-->
        <template #default="scope">
          <span style="cursor: pointer" @click="toDetail(scope.row.id)">{{
            scope.row.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mount" label="卡口" />
      <el-table-column prop="frame" label="画幅" />
      <el-table-column prop="w_pixel" label="像素(万)" />
      <el-table-column prop="score" label="评分" />
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

const cameraInfo = ref([]);

onMounted(() => {
  loadCamera();
});

const toDetail = (id) => {
  router.push({ path: "/devices/camera", query: { id: id } });
};

const loadCamera = async () => {
  let keyword = "";

  let res = await axios.get(`/camera/search?keyword=${keyword}`);
  // console.log(res);

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
  }

  cameraInfo.value = datas;
};
</script>

<style lang="scss" scoped></style>
