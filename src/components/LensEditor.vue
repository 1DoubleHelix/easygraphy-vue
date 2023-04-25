<!-- 镜头信息编辑 -->
<template>
  <div class="lens-editor">
    <el-dialog
      width="1000px"
      :title="dialogTitle"
      v-model="dialogVisible"
      :before-close="handleClose"
      class="dialog-component"
    >
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
        <el-form-item label="是否变焦" prop="zoom">
          <el-input v-model="formInfo.zoom"></el-input>
        </el-form-item>
        <el-form-item label="传感器尺寸" prop="frame">
          <el-input v-model="formInfo.frame"></el-input>
        </el-form-item>
        <el-form-item label="最小焦距" prop="min_focal">
          <el-input v-model="formInfo.min_focal"></el-input>
        </el-form-item>
        <el-form-item label="最大焦距" prop="max_focal">
          <el-input v-model="formInfo.max_focal"></el-input>
        </el-form-item>
        <el-form-item label="等效焦距" prop="equivalent_focal">
          <el-input v-model="formInfo.equivalent_focal"></el-input>
        </el-form-item>
        <el-form-item label="最大光圈" prop="max_aperture">
          <el-input v-model="formInfo.max_aperture"></el-input>
        </el-form-item>
        <el-form-item label="参考价格(元)" prop="price">
          <el-input v-model="formInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="防抖" prop="ois">
          <el-input v-model="formInfo.ois"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="formInfo.weight"></el-input>
        </el-form-item>
        <el-form-item label="滤镜尺寸" prop="filter_size">
          <el-input v-model="formInfo.filter_size"></el-input>
        </el-form-item>
        <el-form-item label="最小对焦距离" prop="min_focus_distance">
          <el-input v-model="formInfo.min_focus_distance"></el-input>
        </el-form-item>
        <el-form-item label="放大倍率" prop="magnification">
          <el-input v-model="formInfo.magnification"></el-input>
        </el-form-item>
        <el-form-item label="发布年份" prop="release_year">
          <el-input v-model="formInfo.release_year"></el-input>
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
          <el-button v-else type="primary" @click="handleAdd">添加</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import * as api from "../api/index";

const dialogVisible = ref(false);
const props = defineProps({
  dialogTitle: String,
  formInfo: Object,
  isAdd: Boolean,
});

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

// 应该对表单数据深拷贝，不然会影响到原始数据

// 添加
const handleAdd = async () => {
  let res = await api.lensAdd(props.formInfo);
  if (res.code === 200) {
    ElMessage.success("添加成功");
    dialogVisible.value = false;
  } else {
    ElMessage.warning(res.msg);
  }
};

// 修改
const handleUpdate = async (id) => {
  let res = await api.lensUpdate(props.formInfo);
  if (res.code === 200) {
    ElMessage.success(res.msg);
    dialogVisible.value = false;
  } else {
    ElMessage.warning(res.msg);
  }
};

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false;
};

defineExpose({
  dialogVisible,
});
</script>

<style lang="scss" scoped></style>
