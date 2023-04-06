<!-- 相机信息编辑 -->
<template>
  <div class="camera-editor">
    <el-dialog
      width="1000px"
      :title="dialogTitle"
      v-model="dialogVisible"
      :before-close="handleClose"
      class="dialog-component"
    >
      <span>{{ formInfo }}</span>
      <el-form ref="formInfo" :model="formInfo">
        <el-form-item label="品牌" prop="brand">
          <el-select v-model="formInfo.brand">
            <el-option label="尼康" value="Nikon"></el-option>
            <el-option label="索尼" value="Sony"></el-option>
            <el-option label="佳能" value="Canon"></el-option>
            <el-option label="松下" value="Panasonic"></el-option>
            <el-option label="富士" value="Fuji"></el-option>
            <el-option label="宾得" value="Pentax"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="name">
          <el-input v-model="formInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="卡口" prop="mount">
          <el-select v-model="formInfo.mount">
            <el-option
              v-for="item in mountOptions"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="formInfo.type"></el-input>
        </el-form-item>
        <el-form-item label="传感器尺寸" prop="frame">
          <el-input v-model="formInfo.frame"></el-input>
        </el-form-item>
        <el-form-item label="发布年份" prop="release_year">
          <el-input v-model="formInfo.release_year"></el-input>
        </el-form-item>
        <el-form-item label="参考价格(元)" prop="price">
          <el-input v-model="formInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="像素(万)" prop="w_pixel">
          <el-input v-model="formInfo.w_pixel"></el-input>
        </el-form-item>
        <el-form-item label="评分" prop="score">
          <el-input v-model="formInfo.score"></el-input>
        </el-form-item>
        <el-form-item label="处理器" prop="processor">
          <el-input v-model="formInfo.processor"></el-input>
        </el-form-item>
        <el-form-item label="防抖" prop="ois">
          <el-input v-model="formInfo.ois"></el-input>
        </el-form-item>
        <el-form-item label="对焦方式" prop="focus">
          <el-input v-model="formInfo.focus"></el-input>
        </el-form-item>
        <el-form-item label="对焦点数量" prop="focal_point">
          <el-input v-model="formInfo.focal_point"></el-input>
        </el-form-item>
        <el-form-item label="眼部追踪" prop="eye_focus">
          <el-input v-model="formInfo.eye_focus"></el-input>
        </el-form-item>
        <el-form-item label="感光度" prop="iso">
          <el-input v-model="formInfo.iso"></el-input>
        </el-form-item>
        <el-form-item label="取景器" prop="viewfinder">
          <el-input v-model="formInfo.viewfinder"></el-input>
        </el-form-item>
        <el-form-item label="连拍速度" prop="shoot_speed">
          <el-input v-model="formInfo.shoot_speed"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="formInfo.weight"></el-input>
        </el-form-item>
        <el-form-item label="最高视频规格" prop="video">
          <el-input v-model="formInfo.video"></el-input>
        </el-form-item>
        <el-form-item label="视频色深" prop="video_color_depth">
          <el-input v-model="formInfo.video_color_depth"></el-input>
        </el-form-item>
        <el-form-item label="色度采样" prop="yuv">
          <el-input v-model="formInfo.yuv"></el-input>
        </el-form-item>
        <el-form-item label="双原生ISO" prop="dual_iso">
          <el-input v-model="formInfo.dual_iso"></el-input>
        </el-form-item>
        <el-form-item label="卡槽数量" prop="card_slot">
          <el-input v-model="formInfo.card_slot"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="other">
          <el-input v-model="formInfo.other"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button
            v-if="!props.isAdd"
            type="primary"
            @click="handleUpdate(formInfo.id)"
            >修改
          </el-button>
          <el-button v-else type="primary" @click="handleAdd">修改 </el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onUpdated, watch } from "vue";
import { ElMessage } from "element-plus";
import * as api from "../api/index";

const dialogVisible = ref(false);
const props = defineProps({
  dialogTitle: String,
  formInfo: Object,
  isAdd: Boolean,
});

// 深拷贝 避免影响原始数据
// const formInfo = reactive({});
// const formInfo = reactive(props.cameraInfo);

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

// 添加
const handleAdd = async () => {
  let res = await api.cameraAdd(props.formInfo);
  if (res.code === 200) {
    ElMessage.success(res.msg);
    dialogVisible.value = false;
  } else {
    ElMessage.warning(res.msg);
  }
};

// 修改
const handleUpdate = async (id) => {
  let res = await api.cameraUpdate(props.formInfo);
  if (res.code === 200) {
    ElMessage.success(res.msg);
    dialogVisible.value = false;
  } else {
    ElMessage.warning(res.msg);
  }
};

// 关闭弹窗
const handleClose = () => {
  // console.log(formInfo.value);
  dialogVisible.value = false;
};
// watch(
//   () => props.cameraInfo,
//   (newVal) => {
//     console.log("watch", newVal);
//     console.log(formInfo);
//     // 深拷贝
//     formInfo = JSON.parse(JSON.stringify(newVal));
//     console.log(formInfo);
//   }
// );

defineExpose({
  dialogVisible,
});
</script>

<style lang="scss" scoped></style>
