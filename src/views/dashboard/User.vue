<template>
  <div class="main-container">
    <n-tabs v-model:value="activeTab" type="line">
      <n-tab-pane name="list" tab="全部用户">
        <div class="user-filter">
          <!-- 筛选 -->
          <el-form :model="userFilter">
            <el-form-item label="昵称">
              <el-input v-model="userFilter.nickname" />
            </el-form-item>
            <el-form-item label="用户ID">
              <el-input v-model="userFilter.id" />
            </el-form-item>
          </el-form>
          <el-button @click="loadUser">筛选</el-button>
        </div>
        <!-- 全部用户 -->
        <div class="user-list">
          <el-table :data="userInfo" stripe border style="width: 100%">
            <el-table-column prop="id" label="用户ID" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="create_time" label="注册时间" />
            <el-table-column label="操作">
              <!-- 自定义列模板 -->
              <template #default="scope">
                <el-button @click="toUpdate(scope.row)">修改</el-button>
                <el-popconfirm
                  title="确认删除?"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="deleteUser(scope.row.id)"
                >
                  <template #reference>
                    <el-button>删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </n-tab-pane>
      <n-tab-pane name="edit" tab="修改信息">
        {{ updateUserInfo }}
        <div class="user-info">
          <span>用户ID:{{ updateUserInfo.id }}</span>
        </div>
        <el-form :model="updateUserInfo">
          <el-form-item label="用户名">
            <el-input v-model="updateUserInfo.username" />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="updateUserInfo.nickname" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="updateUserInfo.email" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="updateUserInfo.password" />
          </el-form-item>
        </el-form>
        <el-popconfirm
          title="确认修改?"
          confirm-button-text="确认"
          cancel-button-text="取消"
          @confirm="updateUser"
        >
          <template #reference>
            <el-button>修改</el-button>
          </template>
        </el-popconfirm>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import RichTextEditor from "../../components/RichTextEditor.vue";
import * as api from "../../api/index.js";

// 使用 moment 时间戳格式化
import moment from "moment";
import momentCN from "../../utils/monentCN";
import { ElMessage } from "element-plus";

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();

const activeTab = ref("list");
const userFilter = reactive({
  id: "",
  nickname: "",
});
const pageInfo = reactive({
  page: 1,
  pageSize: 20,
  count: 0,
  pageCount: 0,
});
const userInfo = ref([]);
const updateUserInfo = reactive({
  id: 0,
  username: "",
  nickname: "",
  email: "",
  password: "",
});

onMounted(() => {
  loadUser();
});

// 加载用户
const loadUser = async () => {
  const res = await api.userList({
    page: pageInfo.page,
    pageSize: pageInfo.pageSize,
    id: userFilter.id,
    nickname: userFilter.nickname,
  });
  if (res.code === 200) {
    for (let row of res.data.rows) {
      // 时间戳格式化
      row.create_time = moment(row.create_time).format("lll");
    }
    userInfo.value = res.data.rows;

    // 分页
    pageInfo.count = res.data.count;
    pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
  } else {
    ElMessage.error(res.msg);
  }
};

// 传入用户 跳转修改页
const toUpdate = (row) => {
  updateUserInfo.id = row.id;
  updateUserInfo.username = row.username;
  updateUserInfo.nickname = row.nickname;
  updateUserInfo.email = row.email;
  activeTab.value = "edit";
  console.log(updateUserInfo);
};
// 修改用户信息
const updateUser = async () => {
  const res = await api.userUpdate(updateUserInfo);
  if (res.code === 200) {
    ElMessage.success(res.msg);
    loadUser();
    activeTab.value = "list";
  } else {
    ElMessage.error(res.msg);
  }
};

// 删除用户
const deleteUser = async (id) => {
  const res = await api.userDelete(id);
  if (res.code === 200) {
    ElMessage.success(res.msg);
    loadUser();
  } else {
    ElMessage.error(res.msg);
  }
};
</script>

<style lang="scss" scoped></style>
