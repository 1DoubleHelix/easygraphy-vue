<template>
  <div>
    <!-- 添加标签 -->
    <n-button @click="showAddModel = true">添加标签</n-button>

    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tag, index) in tagList">
          <td>{{ tag.id }}</td>
          <td>{{ tag.name }}</td>
          <td>
            <n-space>
              <n-button @click="toUpdate(tag)">修改</n-button>
              <n-button @click="deleteTag(tag)">删除</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>

  <!-- 添加分类 弹框 -->
  <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">
    <template #header>
      <div>添加标签</div>
    </template>
    <div>
      <n-input
        v-model:value="addTagTemp.name"
        type="text"
        placeholder="请输入名称"
      />
    </div>
    <template #action>
      <div>
        <n-button @click="addTag">提交</n-button>
      </div>
    </template>
  </n-modal>

  <!-- 修改分类 弹框 -->
  <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
    <template #header>
      <div>修改标签</div>
    </template>
    <div>
      <n-input
        v-model:value="updateTagTemp.name"
        type="text"
        placeholder="请输入名称"
      />
    </div>
    <template #action>
      <div>
        <n-button @click="updateTag">提交</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";

const router = useRouter();
const route = useRoute();

// 使用Naive的独立API 提示信息组件
const message = inject("message");
const dialog = inject("dialog");

const axios = inject("axios");
onMounted(() => {
  // 挂载页面时请求数据
  loadDatas();
});

// 绑定数据

// 初始化弹窗
const showAddModel = ref(false);
const showUpdateModel = ref(false);

// 添加标签 临时数据
const addTagTemp = reactive({
  name: "",
});
const tagList = ref([]);
const addTag = async () => {
  let res = await axios.post("/api/tag/add", {
    name: addTagTemp.name,
  });

  if (res.data.code == 200) {
    loadDatas();
    message.info(res.data.msg);
  } else {
    message.error(res.data.msg);
  }

  // 隐藏添加框
  showAddModel.value = false;
};

// 删除标签
const deleteTag = async (tag) => {
  dialog.warning({
    title: "警告",
    content: "是否要删除",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      let res = await axios.delete(`/api/tag/delete?id=${tag.id}`);
      if (res.data.code == 200) {
        loadDatas();
        message.info(res.data.msg);
      } else {
        message.error(res.data.msg);
      }
    },
    onNegativeClick: () => {},
  });
};

// 修改标签
const updateTagTemp = reactive({
  id: 0,
  name: "",
});
const toUpdate = async (tag) => {
  showUpdateModel.value = true;
  updateTagTemp.id = tag.id;
  updateTagTemp.name = tag.name;
};
// 真正提交数据
const updateTag = async () => {
  let res = await api.tagUpdate({
    id: updateTagTemp.id,
    name: updateTagTemp.name,
  });

  if (res.data.code == 200) {
    loadDatas();
    message.info(res.data.msg);
  } else {
    message.error(res.data.msg);
  }

  // 隐藏添加框
  showUpdateModel.value = false;
};

// 加载数据 修改表后使用 重新加载
const loadDatas = async () => {
  let res = await api.tagList();
  // console.log(res);
  tagList.value = res.results;
};
</script>

<style scoped></style>
