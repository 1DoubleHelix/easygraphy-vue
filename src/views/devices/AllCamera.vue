<template>
  <div class="main-container">
    <!-- 选择相机 -->
    <div class="camera-filter">
      <el-form :model="cameraFilter" :rules="cameraFilterRules" inline>
        <el-form-item label="按型号搜索">
          <el-input v-model="cameraFilter.keyword" placeholder="通过型号查找" />
        </el-form-item>
        <el-form-item label="卡口">
          <el-select
            v-model="cameraFilter.mount"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in mountOptions"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="传感器尺寸">
          <el-select
            v-model="cameraFilter.frame"
            clearable
            placeholder="请选择"
          >
            <el-option label="全画幅" value="FX" />
            <el-option label="半画幅" value="DX" />
          </el-select>
        </el-form-item>
        <el-form-item label="像素区间(万)">
          <el-col :span="11">
            <el-form-item prop="minPixel">
              <el-input-number
                v-model="cameraFilter.minPixel"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2"><span>-</span></el-col>
          <el-col :span="11">
            <el-form-item prop="maxPixel">
              <el-input-number
                v-model="cameraFilter.maxPixel"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="价格区间(元)">
          <el-col :span="11">
            <el-form-item prop="minPrice">
              <el-input-number
                v-model="cameraFilter.minPrice"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2"><span>-</span></el-col>
          <el-col :span="11">
            <el-form-item prop="maxPrice">
              <el-input-number
                v-model="cameraFilter.maxPrice"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <el-button @click="loadCamera">筛选</el-button>
    </div>
    <!-- 相机表格 -->
    <div class="camera-table">
      <el-table :data="cameraInfo" stripe border style="width: 100%">
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
        <el-table-column prop="frame" label="传感器尺寸" />
        <el-table-column prop="w_pixel" label="像素(万)" />
        <el-table-column prop="score" label="评分" />
        <el-table-column prop="price" label="参考价格(元)" />
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
  </div>
  <div class="bg"></div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import tableToChinese from "../../utils/tableToChinese.js";

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

const cameraFilter = reactive({
  mount: "",
  frame: "",
  minPixel: 1000,
  maxPixel: 7000,
  minPrice: 0,
  maxPrice: 50000,
  keyword: "",
});
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

// 表单验证规则
const checkCameraMinPixel = (rule, value, callback) => {
  if (value < 1000) {
    callback(new Error("不小于1000"));
  } else if (value > cameraFilter.maxPixel) {
    callback(new Error("不大于最高像素"));
  } else {
    callback();
  }
};
const checkCameraMaxPixel = (rule, value, callback) => {
  if (value > 7000) {
    callback(new Error("不大于7000"));
  } else if (value < cameraFilter.minPixel) {
    callback(new Error("不小于最低像素"));
  } else {
    callback();
  }
};
const checkMinPrice = (rule, value, callback) => {
  if (value < 0) {
    callback(new Error("价格不能为负数"));
  } else if (value > cameraFilter.maxPrice) {
    callback(new Error("不大于最高价格"));
  } else {
    callback();
  }
};
const checkMaxPrice = (rule, value, callback) => {
  if (value > 200000) {
    callback(new Error("价格不高于200000"));
  } else if (value < cameraFilter.minPrice) {
    callback(new Error("不小于最低价格"));
  } else {
    callback();
  }
};
// 相机筛选
const cameraFilterRules = ref({
  minPixel: [{ validator: checkCameraMinPixel, trigger: "change" }],
  maxPixel: [{ validator: checkCameraMaxPixel, trigger: "change" }],
  minPrice: [{ validator: checkMinPrice, trigger: "change" }],
  maxPrice: [{ validator: checkMaxPrice, trigger: "change" }],
});

const toDetail = (id) => {
  router.push({ path: "/devices/camera", query: { id } });
};

const loadCamera = async () => {
  let res = await api.searchCamera({
    mount: cameraFilter.mount,
    frame: cameraFilter.frame,
    minPixel: cameraFilter.minPixel,
    maxPixel: cameraFilter.maxPixel,
    minPrice: cameraFilter.minPrice,
    maxPrice: cameraFilter.maxPrice,
    keyword: cameraFilter.keyword,
    page: pageInfo.page,
    pageSize: pageInfo.pageSize,
  });

  let datas = res.data.rows;
  // 汉化表格
  tableToChinese(datas);

  cameraInfo.value = datas;
  pageInfo.count = res.data.count;
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 1200px;
  margin: auto;
  .camera-table {
    margin: auto;
    width: 1200px;
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
