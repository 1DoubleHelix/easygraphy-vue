<template>
  <div class="main-container">
    <!-- 组合编辑区 -->
    <div class="combine-devices">
      <el-row>
        <el-col :span="8" class="camera">
          <el-card v-if="combineInfo.camera_id != ''"
            >{{ combineTemp.camera.name }}
            <el-button @click="deleteCamera">移除</el-button>
          </el-card>
          <el-card v-else>没相机</el-card>
        </el-col>
        <el-col :span="16" class="lens">
          <el-card v-if="combineInfo.lensGroup.length">
            <div v-for="(lens, index) in combineTemp.lensGroup" :key="index">
              {{ lens.name }}
              <el-button @click="deleteLens(lens.id)">移除</el-button>
            </div>
          </el-card>
          <el-card v-else>没镜头</el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 备注 -->
    <div class="remarks">
      <el-input
        v-model="combineInfo.title"
        maxlength="20"
        show-word-limit
        placeholder="输入标题"
      />
      <el-input
        v-model="combineInfo.content"
        maxlength="200"
        :rows="2"
        type="textarea"
        placeholder="请输入备注"
        show-word-limit
      />
    </div>
    <div class="submit">
      <el-button @click="addCombine">提交</el-button>
    </div>
    <!-- 选择相机 -->
    <div class="select-camera">
      <el-form :model="cameraFilter" :rules="cameraFilterRules">
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
        <el-form-item label="min像素(万)" prop="minPixel">
          <el-input-number
            v-model="cameraFilter.minPixel"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="max像素(万)" prop="maxPixel">
          <el-input-number
            v-model="cameraFilter.maxPixel"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="min价格" prop="minPrice">
          <el-input-number
            v-model="cameraFilter.minPrice"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="max价格" prop="maxPrice">
          <el-input-number
            v-model="cameraFilter.maxPrice"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <el-button @click="loadCamera">筛选</el-button>
      <el-table :data="cameraInfo" stripe border style="width: 100%">
        <el-table-column prop="brand" label="品牌" />
        <el-table-column prop="name" label="型号" />
        <el-table-column prop="mount" label="卡口" />
        <el-table-column prop="frame" label="传感器尺寸" />
        <el-table-column prop="w_pixel" label="像素(万)" />
        <el-table-column prop="score" label="评分" />
        <el-table-column prop="price" label="参考价格(元)" />
        <el-table-column label="操作">
          <!-- 自定义列模板 -->
          <template #default="scope">
            <el-button size="small" @click="addCamera(scope.row.id)"
              >添加</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="cameraPageInfo.count"
        :page-size="cameraPageInfo.pageSize"
        v-model:current-page="cameraPageInfo.page"
        @update:current-page="loadCamera()"
      />
    </div>
    <!-- 选择镜头 -->
    <div class="select-lens">
      <el-form :model="lensFilter" :rules="lensFilterRules">
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
        <el-form-item label="min焦距" prop="minFocal">
          <el-input-number
            v-model="lensFilter.minFocal"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="max焦距" prop="maxFocal">
          <el-input-number
            v-model="lensFilter.maxFocal"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="min价格" prop="minPrice">
          <el-input-number
            v-model="lensFilter.minPrice"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="max价格" prop="maxPrice">
          <el-input-number
            v-model="lensFilter.maxPrice"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <el-button @click="loadLens">筛选</el-button>
      <el-table :data="lensInfo" stripe border style="width: 100%">
        <el-table-column prop="brand" label="品牌" />
        <el-table-column prop="name" label="型号" />
        <el-table-column prop="mount" label="卡口" />
        <el-table-column prop="frame" label="画幅" />
        <el-table-column prop="min_focal" label="焦段" />
        <el-table-column prop="max_aperture" label="最大光圈" />
        <el-table-column prop="price" label="参考价格(元)" />
        <el-table-column label="操作">
          <!-- 自定义列模板 -->
          <template #default="scope">
            <el-button size="small" @click="addLens(scope.row.id)"
              >添加</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="lensPageInfo.count"
        :page-size="lensPageInfo.pageSize"
        v-model:current-page="lensPageInfo.page"
        @update:current-page="loadLens()"
      />
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
const cameraPageInfo = reactive({
  page: 1,
  pageSize: 8,
  count: 0,
});

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
const lensPageInfo = reactive({
  page: 1,
  pageSize: 10,
  count: 0,
});

// 组合数据 待发送
const combineInfo = reactive({
  title: "",
  content: "",
  camera_id: "",
  lensGroup: ref([]),
});
// 组合数据 临时展示已选设备
const combineTemp = reactive({
  camera: {},
  lensGroup: ref([]),
});

onMounted(() => {
  loadCamera();
  loadLens();
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
// 相机筛选
const cameraFilterRules = ref({
  minPixel: [{ validator: checkCameraMinPixel, trigger: "change" }],
  maxPixel: [{ validator: checkCameraMaxPixel, trigger: "change" }],
  minPrice: [{ validator: checkMinPrice, trigger: "change" }],
  maxPrice: [{ validator: checkMaxPrice, trigger: "change" }],
});
// 镜头筛选
const lensFilterRules = ref({
  minFocal: [{ validator: checkLensMinFocal, trigger: "change" }],
  maxFocal: [{ validator: checkLensMaxFocal, trigger: "change" }],
  minPrice: [{ validator: checkMinPrice, trigger: "change" }],
  maxPrice: [{ validator: checkMaxPrice, trigger: "change" }],
});

// 加载相机数据
const loadCamera = async () => {
  let res = await api.searchCamera({
    mount: cameraFilter.mount,
    frame: cameraFilter.frame,
    minPixel: cameraFilter.minPixel,
    maxPixel: cameraFilter.maxPixel,
    minPrice: cameraFilter.minPrice,
    maxPrice: cameraFilter.maxPrice,
    keyword: cameraFilter.keyword,
    page: cameraPageInfo.page,
    pageSize: cameraPageInfo.pageSize,
  });

  let datas = res.data.rows;
  // 汉化品牌
  tableToChinese(datas);

  cameraInfo.value = datas;
  cameraPageInfo.count = res.data.count;
};

// 加载镜头数据
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
    keyword: cameraFilter.keyword,
    page: lensPageInfo.page,
    pageSize: lensPageInfo.pageSize,
  });

  let datas = res.data.rows;
  // 汉化品牌
  tableToChinese(datas);

  lensInfo.value = datas;
  lensPageInfo.count = res.data.count;
};

// 添加相机
const addCamera = async (id) => {
  if (combineInfo.camera_id != "") {
    ElMessage("组合最多只能有 1 台相机");
  } else {
    combineInfo.camera_id = id;
    // 添加临时数据
    let res = await api.cameraDetail(id);
    combineTemp.camera = res.results;
    ElMessage({
      message: "添加相机成功",
      type: "success",
    });
  }
};
// 删除相机
const deleteCamera = () => {
  if (combineInfo.camera_id == "") {
    ElMessage("组合中没有相机");
  } else {
    combineInfo.camera_id = "";
  }
};
// 添加镜头
const addLens = async (id) => {
  if (combineInfo.lensGroup.length >= 5) {
    ElMessage("组合最多有 5 只镜头");
  } else if (combineInfo.lensGroup.includes(id)) {
    ElMessage({
      message: "镜头已在组合中",
      type: "warning",
    });
  } else {
    combineInfo.lensGroup.push(id);
    // 添加临时数据
    let res = await api.lensDetail(id);
    combineTemp.lensGroup.push(res.results);
    ElMessage({
      message: "添加镜头成功",
      type: "success",
    });
  }
};
// 删除镜头
const deleteLens = (id) => {
  if (combineInfo.lensGroup.length == 0) {
    ElMessage("组合中没有镜头");
  } else {
    for (let i = combineInfo.lensGroup.length - 1; i >= 0; i--) {
      if (combineInfo.lensGroup[i] == id) {
        combineInfo.lensGroup.splice(i, 1);
        combineTemp.lensGroup.splice(i, 1);
      }
    }
  }
};

const addCombine = async () => {
  let res = await api.addCombine(combineInfo);
  console.log(combineInfo.lensGroup);
  console.log(res);
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 1200px;
  margin: auto;
  background-color: #bfa;
}
</style>
