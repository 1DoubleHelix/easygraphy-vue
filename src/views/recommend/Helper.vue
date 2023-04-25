<template>
  <div class="main-container">
    <!-- 组合编辑区 -->
    <div class="combine-devices">
      <el-row>
        <el-col :span="8" class="camera">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>相机</span>
              </div>
            </template>
            <div v-if="combineInfo.camera_id != ''">
              <el-image
                class="logo"
                :src="`/src/assets/logo/${combineTemp.camera.brand}.png`"
                fit="cover"
              />
              <div class="name">
                {{ combineTemp.camera.brand + " " + combineTemp.camera.name }}
              </div>
              <el-button @click="deleteCamera">移除</el-button>
            </div>
            <div v-else class="tips">
              <span>
                请在筛选结果中挑选相机，组合中只能有一个相机，优先考虑无反相机
              </span>
              <p>
                卡口系统：将影响镜头的选择，E卡口拥有无反系统中较大的镜头群，EF卡口和F卡口拥有单反系统中较大的镜头群
              </p>
              <p>
                摄影风格：如果需要拍摄风光，请尽量选择高像素、全画幅的相机，如果需要拍摄人像，2400万像素左右的相机可以满足大部分需求
              </p>
              <p>
                预算：如果预算较低，可以选择半画幅产品，如果不考虑视频功能，F卡口系统的性价比较高
              </p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16" class="lens">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>镜头</span>
              </div>
            </template>
            <div
              v-if="combineTemp.lensGroup.length"
              v-for="(lens, index) in combineTemp.lensGroup"
              :key="index"
              class="item"
            >
              <span>
                <el-image
                  class="logo"
                  :src="`/src/assets/logo/${lens.brand}.png`"
                  fit="cover"
                />
              </span>
              <span class="name">
                {{ lens.brand + " " + lens.name }}
              </span>
              <el-button @click="deleteLens(lens.id)">移除</el-button>
            </div>
            <div v-else class="tips">
              <span> 请在筛选结果中挑选镜头，组合中可以有多达5个镜头 </span>
              <p>
                传感器尺寸：全画幅相机应该搭配全画幅镜头使用，虽然某些卡口支持半画幅卡口安装到全画幅使用，但是不建议这样搭配。如果选择了半画幅相机，可以选择全画幅镜头，但是要关注等效焦段
              </p>
              <p>
                摄影风格：如果要拍摄人像，请尽量选择至少一个焦距或等效焦距在50mm-85mm的定焦镜头，并尽量选择大光圈镜头。其他两种风格应尽量包含至少一个标准变焦镜头。
              </p>
              <p>
                预算：如果预算较低，可以选择半画幅、单反系统。无反系统种E卡口有很多高性价比国产镜头。单反系统的镜头数量庞大，F卡口的性价比较高。
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card class="remark" shadow="hover">
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
        <el-button @click="addCombine">提交</el-button>
      </el-card>
    </div>

    <!-- 输入条件 -->
    <el-card shadow="hover" class="select">
      <el-form :model="selectFilter" :rules="filterRules" inline>
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
        <el-form-item label="预算限制" prop="budget">
          <el-select v-model="selectFilter.budget" placeholder="请选择">
            <el-option label="低" value="1" />
            <el-option label="标准" value="2" />
            <el-option label="高" value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button @click="loadInfo">筛选</el-button>
    </el-card>

    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="选择相机" name="camera">
        <p
          class="tips"
          v-if="selectFilter.mount == 'F' && selectFilter.frame == 'DX'"
        >
          您选择了尼康F卡口半画幅系统，某些入门相机（D3XXX）没有对焦马达，某些自动对焦镜头需要依赖机身的对焦马达，请进入镜头详情页查看备注
        </p>
        <div v-if="cameraInfo.length" class="camera">
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
        </div>
      </el-tab-pane>
      <el-tab-pane label="选择镜头" name="lens">
        <!-- 使用v-if判断5个种类的镜头表格是否显示 -->
        <div v-if="lensInfo.prime.length" class="lens">
          <div class="tips">
            定焦镜头：较浅的景深带来背景虚化效果，可以突出被摄主体、营造氛围
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
            <p>标准变焦镜头：适应大多数拍摄场景，提供了现实、自然的视角</p>
            <p>如果预算充足，可以选择最大光圈恒定为F2.8的镜头</p>
            <p>
              尽量不要选择变焦范围很大，但是光圈较小，价格较低的镜头，通常画质不好
            </p>
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
            <p>
              远摄变焦镜头：常用于风光拍摄、人像摄影、体育摄影，可以模糊背景，同时保持被摄主体清晰
            </p>
            <p>但是请注意，焦段相同的镜头，较大的光圈可以带来更浅的景深</p>
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
          <div class="tips">
            <p>
              广角定焦镜头：常用于风光拍摄，或者使狭小的空间看起来更大，例如在摄影棚中拍摄人像
            </p>
          </div>
          <el-table
            :data="lensInfo.widePrime"
            stripe
            border
            style="width: 100%"
          >
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
          <div class="tips">
            <p>
              广角变焦镜头：常用于风光拍摄，或者使狭小的空间看起来更大，例如在摄影棚中拍摄人像
            </p>
            <p>和广角定焦镜头相比，广角变焦镜头的最大光圈可能不如前者</p>
          </div>
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
      </el-tab-pane>
    </el-tabs>
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
import tableToChinese from "../../utils/tableToChinese";
import { ElMessage } from "element-plus";
moment.locale("zh-cn", momentCN);
const router = useRouter();
const route = useRoute();

const activeTab = ref("camera");

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
const checkBudget = (rule, value, callback) => {
  if (value == "1" && selectFilter.frame == "FX") {
    callback(new Error("全画幅没有低预算相机"));
  }
  if (value == "3" && selectFilter.frame == "DX") {
    callback(new Error("半画幅没有高预算相机"));
  }
};
const filterRules = ref({
  frame: [{ validator: checkFrame, trigger: "change" }],
  budget: [{ validator: checkBudget, trigger: "change" }],
});

// 加载筛选后的数据
const loadInfo = async () => {
  // 加载相机
  let cameraRes = await api.cameraHelper(selectFilter);
  tableToChinese(cameraRes.data);
  cameraInfo.value = cameraRes.data;
  // 加载镜头
  let lensRes = await api.lensHelper(selectFilter);

  if (lensRes.data.prime == null) {
    lensInfo.prime = [];
  } else {
    tableToChinese(lensRes.data.prime);
    lensInfo.prime = lensRes.data.prime;
  }

  if (lensRes.data.zoom == null) {
    lensInfo.zoom = [];
  } else {
    tableToChinese(lensRes.data.zoom);
    lensInfo.zoom = lensRes.data.zoom;
  }

  if (lensRes.data.teleZoom == null) {
    lensInfo.teleZoom = [];
  } else {
    tableToChinese(lensRes.data.teleZoom);
    lensInfo.teleZoom = lensRes.data.teleZoom;
  }

  if (lensRes.data.widePrime == null) {
    lensInfo.widePrime = [];
  } else {
    tableToChinese(lensRes.data.widePrime);
    lensInfo.widePrime = lensRes.data.widePrime;
  }

  if (lensRes.data.wideZoom == null) {
    lensInfo.wideZoom = [];
  } else {
    tableToChinese(lensRes.data.wideZoom);
    lensInfo.wideZoom = lensRes.data.wideZoom;
  }
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
  if (res.code === 200) {
    ElMessage.success("添加组合成功");
  } else {
    ElMessage.error("添加组合失败");
  }
  console.log(res);
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 1200px;
  margin: auto;
  .combine-devices {
    .camera {
      .el-card {
        margin: 10px;
        height: 380px;
        .logo {
          display: block;
          height: 200px;
          width: 200px;
          margin: auto;
        }
        .name {
          margin-top: 10px;
          font-size: 25px;
          color: #666;
          text-align: center;
        }
        .el-button {
          width: 300px;
          margin: 10px auto;
          display: block;
        }
      }
    }
    .lens {
      .el-card {
        margin: 10px;
        height: 380px;
        .item {
          display: flex;
          margin-top: 5px;
          align-items: center;
          .logo {
            padding: 2px;
            border-radius: 3px;
            border: #dcdfe6 solid 1px;
            height: 40px;
          }
          .name {
            margin-left: 10px;
            font-size: 20px;
            color: #333;
          }
          .el-button {
            width: 80px;
            margin-left: auto;
          }
        }
      }
    }
    .tips {
      span {
        font-size: 20px;
        font-weight: normal;
        color: #000;
      }
      font-size: 15px;
      // font-weight: 300;
      color: #333;
    }
    .remark {
      margin: 10px;
    }
  }
  .select {
    margin: 10px;
  }
  .el-tabs {
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
