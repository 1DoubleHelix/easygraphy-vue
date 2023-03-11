<template>
  <div class="camera-search">
    <el-input
        v-model="keyword"
        @input="loadCamera"
        placeholder="通过型号查找"
    />
  </div>
  <div class="camera-table">
    <el-table :data="cameraInfo" stripe border style="width: 100%">
      <el-table-column prop="brand" label="品牌"/>
      <el-table-column label="型号">
        <!--自定义列模板 实现跳转-->
        <template #default="scope">
          <span style="cursor: pointer" @click="toDetail(scope.row.id)">{{
              scope.row.name
            }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mount" label="卡口"/>
      <el-table-column prop="frame" label="传感器尺寸"/>
      <el-table-column prop="w_pixel" label="像素(万)"/>
      <el-table-column prop="score" label="评分"/>
      <el-table-column prop="price" label="参考价格(元)"/>
    </el-table>
    <el-pagination
        background
        layout="prev, pager, next"
        :total="pageInfo.count"
        :page-size="pageInfo.pageSize"
        v-model:current-page="pageInfo.page"
        @update:current-page="loadCamera()"
    />
  </div>
</template>

<script setup>
import {ref, reactive, inject, onMounted, computed} from "vue";
import {useRouter, useRoute} from "vue-router";
import * as api from "../../api/index.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import tableToChinese from "../../utils/tableToChinese.js";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

const axios = inject("axios");

const cameraInfo = ref([]);
const keyword = ref("");
const pageInfo = reactive({
  page: 1,
  pageSize: 13,
  count: 0,
});

onMounted(() => {
  loadCamera();
});

const toDetail = (id) => {
  router.push({path: "/devices/camera", query: {id: id}});
};

const loadCamera = async () => {
  let res = await api.searchCamera({
    keyword: keyword.value,
    page: pageInfo.page,
    pageSize: pageInfo.pageSize,
  });

  let datas = res.data.rows;
  // 汉化表格
  tableToChinese((datas))

  cameraInfo.value = datas;
  pageInfo.count = res.data.count;
};
</script>

<style lang="scss" scoped>
.camera-search {
  margin: 20px auto;
  width: 1000px;
}

.camera-table {
  margin: auto;
  width: 1000px;
}
</style>
