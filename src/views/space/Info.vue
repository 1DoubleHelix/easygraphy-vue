<template>
  <div class="user-info">
    <el-form :model="userInfo" label-position="top">
      <el-form-item label="用户ID">{{ store.id }}</el-form-item>
      <el-form-item label="用户名">{{ store.username }}</el-form-item>
      <el-form-item label="密码">
        <el-input
          type="password"
          show-password
          v-model="userInfo.password"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="userInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUserInfo">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";
import { userStore } from "../../stores/userStore.js";
import { ElMessage } from "element-plus";

const router = useRouter();
const route = useRoute();
const store = userStore();

const userInfo = reactive({
  nickname: "",
  password: "",
  email: "",
});

onMounted(() => {
  loadUserInfo();
});

const loadUserInfo = () => {
  userInfo.nickname = store.nickname;
  userInfo.email = store.email;
};

const updateUserInfo = async () => {
  const res = await api.userUpdate(userInfo);
  if (res.code === 200) {
    ElMessage.success(res.msg);
    store.nickname = userInfo.nickname;
    store.email = userInfo.email;
  } else {
    ElMessage.error(res.msg);
  }
};
</script>

<style lang="scss" scoped></style>
