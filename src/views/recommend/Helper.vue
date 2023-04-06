<template>
  <div class="main-container">
    <!-- 组合临时展示区 -->
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
    <!-- 输入条件 -->
    <div class="tips"><span>这里需要给出挑选相机的技巧</span></div>
    <div class="select">
      <el-form :model="selectFilter" :rules="filterRules">
        <el-form-item label="卡口">
          <el-select v-model="selectFilter.mount" placeholder="请选择">
            <el-option-group
              v-for="group in mountOptions"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="传感器尺寸" prop="frame">
          <el-select v-model="selectFilter.frame" placeholder="请选择">
            <el-option label="全画幅" value="FX" />
            <el-option label="半画幅" value="DX" />
          </el-select>
        </el-form-item>
        <el-form-item label="摄影风格">
          <el-select v-model="selectFilter.style" placeholder="请选择">
            <el-option label="日常" value="daily" />
            <el-option label="人像" value="portrait" />
            <el-option label="风光" value="landscape" />
          </el-select>
        </el-form-item>
        <el-form-item label="预算限制">
          <el-select v-model="selectFilter.budget" placeholder="请选择">
            <el-option label="低" value="1" />
            <el-option label="标准" value="2" />
            <el-option label="高" value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button @click="loadInfo">筛选</el-button>

      <div class="tips">
        <span
          >某些尼康入门相机没有对焦马达, 如果选择了(F卡口 半画幅)需要提示</span
        >
      </div>

      <!-- 相机表格 -->
      <el-table :data="cameraInfo" stripe border style="width: 100%">
        <el-table-column prop="brand" label="品牌" />
        <el-table-column prop="name" label="型号" />

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
      <!-- 镜头表格 -->
      <!-- 使用v-if判断5个种类的镜头表格是否显示 -->
      <div v-if="lensInfo.prime.length" class="lens">
        <div class="tips">
          <span> 合理地使用定焦镜头可以虚化背景, 突出主体, 营造氛围 </span>
        </div>
        <el-table :data="lensInfo.prime" stripe border style="width: 100%">
          <el-table-column prop="brand" label="品牌" />
          <el-table-column prop="name" label="型号" />
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
      </div>
      <div v-if="lensInfo.zoom.length" class="lens">
        <div class="tips">
          <span>
            标准变焦镜头, 适应大多数日常拍摄状况, 如果预算充足,
            可以选择最大光圈恒定为F1.8的"大三元"镜头
          </span>
        </div>
        <el-table :data="lensInfo.zoom" stripe border style="width: 100%">
          <el-table-column prop="brand" label="品牌" />
          <el-table-column prop="name" label="型号" />
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
      </div>
      <div v-if="lensInfo.teleZoom.length" class="lens">
        <div class="tips">
          <span>
            远摄变焦镜头, 常用于风光拍摄, 在人像摄影中也可以用于虚化背景,
            突出被摄主体, 但是请注意, 焦段相同的镜头,
            较大的光圈可以带来更浅的景深
          </span>
        </div>
        <el-table :data="lensInfo.teleZoom" stripe border style="width: 100%">
          <el-table-column prop="brand" label="品牌" />
          <el-table-column prop="name" label="型号" />
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
      </div>
      <div v-if="lensInfo.widePrime.length" class="lens">
        <el-table :data="lensInfo.widePrime" stripe border style="width: 100%">
          <el-table-column prop="brand" label="品牌" />
          <el-table-column prop="name" label="型号" />
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
      </div>
      <div v-if="lensInfo.wideZoom.length" class="lens">
        <el-table :data="lensInfo.wideZoom" stripe border style="width: 100%">
          <el-table-column prop="brand" label="品牌" />
          <el-table-column prop="name" label="型号" />
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

const mountOptions = [
  {
    label: "无反",
    options: [
      { value: "E", label: "E 索尼" },
      { value: "Z", label: "Z 尼康" },
      { value: "RF", label: "RF 佳能" },
      { value: "X", label: "X 富士" },
      { value: "L", label: "L 松下" },
    ],
  },
  {
    label: "单反",
    options: [
      { value: "EF", label: "EF 佳能" },
      { value: "F", label: "F 尼康" },
      { value: "K", label: "K 宾得" },
    ],
  },
];
const selectFilter = reactive({
  mount: "",
  frame: "",
  style: "",
  budget: "",
});

const cameraInfo = ref([]);
const lensInfo = reactive({
  prime: ref([]),
  zoom: ref([]),
  teleZoom: ref([]),
  widePrime: ref([]),
  wideZoom: ref([]),
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

onMounted(() => {});

// 表单规则
const checkFrame = (rule, value, callback) => {
  if (value == "FX" && selectFilter.mount == "X") {
    callback(new Error("此卡口没有全画幅产品"));
  }
  if (value == "DX" && selectFilter.mount == "L") {
    callback(new Error("此卡口没有半画幅产品"));
  }
};
const filterRules = ref({
  frame: [{ validator: checkFrame, trigger: "change" }],
});

// 加载筛选后的数据
const loadInfo = async () => {
  let cameraRes = await api.cameraHelper(selectFilter);
  cameraInfo.value = cameraRes.data;
  let lensRes = await api.lensHelper(selectFilter);
  console.log(lensRes);
  // lensInfo = lensRes.data;
  lensInfo.prime = lensRes.data.prime == null ? [] : lensRes.data.prime;
  lensInfo.zoom = lensRes.data.zoom == null ? [] : lensRes.data.zoom;
  lensInfo.teleZoom =
    lensRes.data.teleZoom == null ? [] : lensRes.data.teleZoom;
  lensInfo.widePrime =
    lensRes.data.widePrime == null ? [] : lensRes.data.widePrime;
  lensInfo.wideZoom =
    lensRes.data.wideZoom == null ? [] : lensRes.data.wideZoom;
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
  background-color: #cfa;
}
</style>
