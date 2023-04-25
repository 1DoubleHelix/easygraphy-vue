<template>
  <div class="main-container">
    <!-- 添加标签 -->
    <el-form :model="addTagTemp" inline>
      <el-form-item>
        <el-input v-model="addTagTemp.name" />
      </el-form-item>
      <el-form-item>
        <el-button @click="addTag">添加标签</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tagInfo" stripe border>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column label="操作">
        <!-- 自定义列模板 -->
        <template #default="scope">
          <el-button @click="toUpdate(scope.row)">修改</el-button>
          <el-popconfirm
            title="确认删除?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="deleteTag(scope.row.id)"
          >
            <template #reference>
              <el-button>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改弹窗 -->
    <el-dialog v-model="dialogVisible" title="修改标签">
      <el-form :model="updateTagTemp">
        <el-form-item label="标签名称">
          <el-input v-model="updateTagTemp.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateTag"> 修改 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";
import { ElMessage } from "element-plus";

const router = useRouter();
const route = useRoute();

const dialogVisible = ref(false);
// 添加标签 临时数据
const addTagTemp = reactive({
  name: "",
});
const updateTagTemp = reactive({
  id: 0,
  name: "",
});
const tagInfo = ref([]);

onMounted(() => {
  loadTag();
});

// 添加标签
const addTag = async () => {
  let res = await api.tagAdd(addTagTemp);
  if (res.code == 200) {
    loadTag();
    ElMessage.success(res.msg);
  } else {
    ElMessage.error(res.msg);
  }
};

// 删除标签
const deleteTag = async (id) => {
  let res = await api.tagDelete(id);
  if (res.code == 200) {
    loadTag();
    ElMessage.success("删除成功");
  } else {
    ElMessage.error(res.msg);
  }
};

const toUpdate = async (tag) => {
  dialogVisible.value = true;
  updateTagTemp.id = tag.id;
  updateTagTemp.name = tag.name;
};
const updateTag = async () => {
  let res = await api.tagUpdate(updateTagTemp);

  if (res.code == 200) {
    loadTag();
    ElMessage.info(res.msg);
  } else {
    ElMessage.error(res.msg);
  }

  // 隐藏添加框
  dialogVisible.value = false;
};

const loadTag = async () => {
  let res = await api.tagList();
  tagInfo.value = res.results;
};
</script>

<style lang="scss" scoped>
.main-container {
  padding: 10px;
  .el-form {
    .el-input {
      width: 300px;
    }
  }
}
</style>
