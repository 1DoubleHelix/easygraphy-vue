<template>
  <div class="main-container">
    <!-- 选择镜头 -->
    <el-card class="lens-filter" shadow="hover">
      <el-form :model="lensFilter" :rules="lensFilterRules" inline>
        <el-form-item label="按型号搜索">
          <el-input v-model="lensFilter.keyword" placeholder="通过型号查找" />
        </el-form-item>
        <el-form-item label="卡口">
          <el-select v-model="lensFilter.mount" clearable placeholder="请选择">
            <el-option
              v-for="item in mountOptions"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="画幅">
          <el-select v-model="lensFilter.frame" clearable placeholder="请选择">
            <el-option label="全画幅" value="FX" />
            <el-option label="半画幅" value="DX" />
          </el-select>
        </el-form-item>
        <el-form-item label="定焦/变焦">
          <el-select v-model="lensFilter.zoom" clearable placeholder="请选择">
            <el-option label="变焦" value="1" />
            <el-option label="定焦" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="光圈不小于" prop="maxAperture">
          <el-input-number
            v-model="lensFilter.maxAperture"
            controls-position="right"
            :precision="1"
            :step="0.1"
          />
        </el-form-item>
        <el-form-item label="焦距区间(mm)">
          <el-col :span="11">
            <el-form-item prop="minFocal">
              <el-input-number
                v-model="lensFilter.minFocal"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2"><span>-</span></el-col>
          <el-col :span="11">
            <el-form-item prop="maxFocal">
              <el-input-number
                v-model="lensFilter.maxFocal"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="价格区间(元)">
          <el-col :span="11">
            <el-form-item prop="minPrice">
              <el-input-number
                v-model="lensFilter.minPrice"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2"><span>-</span></el-col>
          <el-col :span="11">
            <el-form-item prop="maxPrice">
              <el-input-number
                v-model="lensFilter.maxPrice"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <el-button @click="loadLens">筛选</el-button>
    </el-card>

    <el-card class="lens-table" shadow="hover">
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
    </el-card>
  </div>
  <div class="bg"></div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import tableToChinese from "../../utils/tableToChinese";
moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

const mountOptions = [
  { value: "E", label: "E 索尼" },
  { value: "Z", label: "Z 尼康" },
  { value: "RF", label: "RF 佳能" },
  { value: "X", label: "X 富士" },
  { value: "L", label: "L 松下、适马、徕卡" },
  { value: "EF", label: "EF 佳能" },
  { value: "F", label: "F 尼康" },
  { value: "K", label: "K 宾得" },
];
const lensFilter = reactive({
  mount: "",
  frame: "",
  zoom: "",
  maxAperture: 22,
  minFocal: 8,
  maxFocal: 1200,
  minPrice: 0,
  maxPrice: 200000,
  keyword: "",
});
const lensInfo = ref([]);
let keyword = ref("");
const pageInfo = reactive({
  page: 1,
  pageSize: 17,
  count: 0,
});

onMounted(() => {
  loadLens();
});

// 表单验证规则
const checkMinPrice = (rule, value, callback) => {
  if (value < 0) {
    callback(new Error("价格不能为负数"));
  } else if (value > lensFilter.maxPrice) {
    callback(new Error("不大于最高价格"));
  } else {
    callback();
  }
};
const checkMaxPrice = (rule, value, callback) => {
  if (value > 200000) {
    callback(new Error("价格不高于200000"));
  } else if (value < lensFilter.minPrice) {
    callback(new Error("不小于最低价格"));
  } else {
    callback();
  }
};
const checkLensMinFocal = (rule, value, callback) => {
  if (value < 8) {
    callback(new Error("焦距不小于8mm"));
  } else if (value > lensFilter.maxFocal) {
    callback(new Error("不大于最大焦距"));
  } else {
    callback();
  }
};
const checkLensMaxFocal = (rule, value, callback) => {
  if (value > 1200) {
    callback(new Error("焦距不大于1200"));
  } else if (value < lensFilter.minFocal) {
    callback(new Error("不小于最小焦距"));
  } else {
    callback();
  }
};
// 镜头筛选
const lensFilterRules = ref({
  minFocal: [{ validator: checkLensMinFocal, trigger: "change" }],
  maxFocal: [{ validator: checkLensMaxFocal, trigger: "change" }],
  minPrice: [{ validator: checkMinPrice, trigger: "change" }],
  maxPrice: [{ validator: checkMaxPrice, trigger: "change" }],
});

const toDetail = (id) => {
  router.push({ path: "/devices/lens", query: { id: id } });
};

const loadLens = async () => {
  let res = await api.searchLens({
    mount: lensFilter.mount,
    frame: lensFilter.frame,
    zoom: lensFilter.zoom,
    maxAperture: lensFilter.maxAperture,
    minFocal: lensFilter.minFocal,
    maxFocal: lensFilter.maxFocal,
    minPrice: lensFilter.minPrice,
    maxPrice: lensFilter.maxPrice,
    keyword: lensFilter.keyword,
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
.main-container {
  width: 1200px;
  margin: auto;
  .lens-filter {
    margin: 10px;
  }
  .lens-table {
    margin: 10px;
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
