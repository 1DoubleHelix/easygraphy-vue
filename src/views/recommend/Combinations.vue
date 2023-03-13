<template>
  <div class="main-container">
    <div class="list">
      <div
        v-for="(combine, index) in combineInfo"
        :key="index"
        @click="toDetail(combine.id)"
      >
        <el-card>{{ combine.title }}</el-card>
      </div>
    </div>
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
  background-color: #bfc;
}
</style>
