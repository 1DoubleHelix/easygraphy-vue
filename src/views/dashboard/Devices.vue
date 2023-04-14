<template>
  <div>
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane name="camera" label="相机">
        <div class="camera-filter">
          <!-- 筛选 -->
          <el-form :model="cameraFilter">
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
          </el-form>
          <el-button @click="loadCamera">筛选</el-button>
        </div>
        <el-button @click="addCamera">添加相机</el-button>
        <!-- 全部相机 -->
        <div class="camera-list">
          <el-table :data="cameraInfo" stripe border style="width: 100%">
            <el-table-column prop="brand" label="品牌" />
            <el-table-column label="型号">
              <!--自定义列模板 实现跳转-->
              <template #default="scope">
                <span
                  style="cursor: pointer"
                  @click="toCameraDetail(scope.row.id)"
                  >{{ scope.row.name }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="mount" label="卡口" />
            <el-table-column prop="frame" label="传感器尺寸" />
            <el-table-column prop="w_pixel" label="像素(万)" />
            <el-table-column prop="score" label="评分" />
            <el-table-column prop="price" label="参考价格(元)" />
            <el-table-column label="操作">
              <!-- 自定义列模板 -->
              <template #default="scope">
                <el-button @click="updateCamera(scope.row)">修改</el-button>
                <el-popconfirm
                  title="确认删除?"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="deleteCamera(scope.row.id)"
                >
                  <template #reference>
                    <el-button>删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
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
        <!-- 新增和修改弹窗 -->
        <CameraEditor
          ref="cameraEditor"
          :dialog-title="cameraDialogTitle"
          :form-info="cameraDialogInfo"
          :is-add="isAdd"
        />
      </el-tab-pane>
      <el-tab-pane name="lens" label="镜头">
        <div class="lens-filter">
          <el-form :model="lensFilter">
            <el-form-item label="卡口">
              <el-select
                v-model="lensFilter.mount"
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
                v-model="lensFilter.frame"
                clearable
                placeholder="请选择"
              >
                <el-option label="全画幅" value="FX" />
                <el-option label="半画幅" value="DX" />
              </el-select>
            </el-form-item>
          </el-form>
          <el-button @click="loadLens">筛选</el-button>
        </div>
        <el-button @click="addLens">添加镜头</el-button>
        <div class="lens-table">
          <el-table :data="lensInfo" stripe border style="width: 100%">
            <el-table-column prop="brand" label="品牌" />
            <el-table-column label="型号">
              <!--自定义列模板 实现跳转-->
              <template #default="scope">
                <span
                  style="cursor: pointer"
                  @click="toLensDetail(scope.row.id)"
                  >{{ scope.row.name }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="mount" label="卡口" />
            <el-table-column prop="frame" label="画幅" />
            <el-table-column prop="min_focal" label="焦段" />
            <el-table-column prop="max_aperture" label="最大光圈" />
            <el-table-column prop="price" label="参考价格(元)" />
            <el-table-column label="操作">
              <!-- 自定义列模板 -->
              <template #default="scope">
                <el-button @click="updateLens(scope.row)">修改</el-button>
                <el-popconfirm
                  title="确认删除?"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="deleteLens(scope.row.id)"
                >
                  <template #reference>
                    <el-button>删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
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
        <!-- 新增和修改弹窗 -->
        <LensEditor
          ref="lensEditor"
          :dialog-title="lensDialogTitle"
          :form-info="lensDialogInfo"
          :is-add="isAdd"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";
import tableToChinese from "../../utils/tableToChinese";
import { ElMessage } from "element-plus";
import CameraEditor from "../../components/CameraEditor.vue";
import LensEditor from "../../components/LensEditor.vue";

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

const activeTab = ref("camera");
const pageInfo = reactive({
  page: 1,
  pageSize: 13,
  count: 0,
});
const cameraInfo = ref([]);
const cameraFilter = reactive({
  mount: "",
  frame: "",
  keyword: "",
});
const lensInfo = ref([]);
const lensFilter = reactive({
  mount: "",
  frame: "",
  keyword: "",
});

// 相机编辑器弹窗
const cameraEditor = ref(null);
const cameraDialogTitle = ref("");
const cameraDialogInfo = ref({});
// 镜头编辑器弹窗
const lensEditor = ref(null);
const lensDialogTitle = ref("");
const lensDialogInfo = ref({});
// 添加还是修改
const isAdd = ref(false);

onMounted(() => {
  loadCamera();
  loadLens();
});

// 加载相机
const loadCamera = async () => {
  let res = await api.searchCamera({
    mount: cameraFilter.mount,
    frame: cameraFilter.frame,
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

// 新增相机
const addCamera = () => {
  isAdd.value = true;
  cameraDialogInfo.value = {};
  cameraDialogTitle.value = "新增相机";
  cameraEditor.value.dialogVisible = true;
};

// 编辑相机
const updateCamera = (row) => {
  isAdd.value = false;
  cameraDialogInfo.value = row;
  cameraDialogTitle.value = "编辑相机";
  cameraEditor.value.dialogVisible = true;
};
// 删除相机
const deleteCamera = (id) => {
  let res = api.cameraDelete(id);
  if (res.code === 200) {
    ElMessage.success("删除成功");
    loadCamera();
  } else {
    ElMessage.error(res.msg);
  }
};

// 加载镜头
const loadLens = async () => {
  let res = await api.searchLens({
    mount: lensFilter.mount,
    frame: lensFilter.frame,
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
// 新增镜头
const addLens = () => {
  isAdd.value = true;
  lensDialogInfo.value = {};
  lensDialogTitle.value = "新增镜头";
  lensEditor.value.dialogVisible = true;
};
// 编辑镜头
const updateLens = (row) => {
  isAdd.value = false;
  lensDialogInfo.value = row;
  lensDialogTitle.value = "编辑镜头";
  lensEditor.value.dialogVisible = true;
};
// 删除镜头
const deleteLens = (id) => {
  let res = api.lensDelete(id);
  if (res.code === 200) {
    ElMessage.success("删除成功");
    loadLens();
  } else {
    ElMessage.error(res.msg);
  }
};

const toCameraDetail = (id) => {
  router.push({ path: "/devices/camera", query: { id } });
};
const toLensDetail = (id) => {
  router.push({ path: "/devices/lens", query: { id } });
};
</script>

<style lang="scss" scoped></style>
