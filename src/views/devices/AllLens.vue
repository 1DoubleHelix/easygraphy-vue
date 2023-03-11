<template>
  <div class="lens-search">
    <el-input v-model="keyword" @input="loadLens" placeholder="通过型号查找" />
  </div>
  <div class="lens-table">
    <el-table :data="lensInfo" stripe border style="width: 100%">
      <el-table-column prop="brand" label="品牌" />
      <!--自定义列模板 实现跳转-->
      <el-table-column label="型号" width="390">
        <!--自定义列模板 实现跳转-->
        <template #default="scope">
          <span style="cursor: pointer" @click="toDetail(scope.row.id)">{{
            scope.row.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mount" label="卡口" />
      <el-table-column prop="frame" label="画幅" />
      <el-table-column prop="min_focal" label="焦段" />
      <el-table-column prop="max_aperture" label="最大光圈" />
      <el-table-column prop="price" label="参考价格(元)" />
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pageInfo.count"
      :page-size="pageInfo.pageSize"
      v-model:current-page="pageInfo.page"
      @update:current-page="loadLens()"
    />
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import tableToChinese from "../../utils/tableToChinese";
moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

// 使用Naive的独立API 提示信息组件
const message = inject("message");
const dialog = inject("dialog");

const axios = inject("axios");

const lensInfo = ref([]);
let keyword = ref("");
const pageInfo = reactive({
  page: 1,
  pageSize: 13,
  count: 0,
});

onMounted(() => {
  loadLens();
});

const toDetail = (id) => {
  router.push({ path: "/devices/lens", query: { id: id } });
};

const loadLens = async () => {
  let res = await api.searchLens({
    keyword: keyword.value,
    page: pageInfo.page,
    pageSize: pageInfo.pageSize,
  });

  let datas = res.data.rows;
  // 汉化品牌
  tableToChinese(datas);

  lensInfo.value = datas;
  pageInfo.count = res.data.count;
};
</script>

<style lang="scss" scoped>
.lens-search {
  margin: 20px auto;
  width: 1000px;
}
.lens-table {
  margin: auto;
  width: 1000px;
}
</style>
