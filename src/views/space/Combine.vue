<template>
  <div class="main-container">
    <div class="combine-list">
      <div v-for="(combine, index) in combineList" :key="index">
        <el-card shadow="never">
          <div class="header">
            <span>{{ combine.title }}</span>
            <el-popconfirm
              title="确认删除?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="deleteCombine(combine)"
            >
              <template #reference>
                <el-button>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
          <div>{{ combine.content }}</div>
          <div>{{ combine.create_time }}</div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import RichTextEditor from "../../components/RichTextEditor.vue";
import * as api from "../../api/index.js";
import { userStore } from "../../stores/userStore.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import { ElMessage } from "element-plus";
const store = userStore();

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

const combineList = ref([]);

onMounted(() => {
  loadCombineList();
});

// 加载组合
const loadCombineList = async () => {
  let res = await api.searchCombine({ userID: store.id });
  let rows = res.data.rows;
  for (let row of rows) {
    // 时间戳格式化
    row.create_time = moment(row.create_time).format("lll");
  }
  if (res.code === 200) {
    combineList.value = res.data.rows;
  } else {
    ElMessage({ message: res.msg, type: "warning" });
  }
};

// 删除组合
const deleteCombine = async (combine) => {
  console.log(combine.id);
  let res = await api.deleteCombine(combine.id);
  if (res.code === 200) {
    ElMessage({ message: "删除成功", type: "success" });
    loadCombineList();
  } else {
    ElMessage({ message: res.msg, type: "warning" });
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  .combine-list {
    .el-card {
      margin-bottom: 20px;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
