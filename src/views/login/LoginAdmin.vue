<template>
  <div class="login">
    <el-card>
      <el-form :model="loginMsg" :rules="loginRules" label-position="top">
        <el-form-item prop="username" label="用户名:">
          <el-input v-model="loginMsg.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password" label="密码:">
          <el-input
            v-model="loginMsg.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-checkbox v-model="loginMsg.remember" label="记住密码"></el-checkbox>
      </el-form>
      <el-button type="primary" @click="login">登录</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { userStore } from "../../stores/userStore.js";
import * as api from "../../api/index.js";

const router = useRouter();
const route = useRoute();
const store = userStore();

// 登录信息
const loginMsg = reactive({
  username: "",
  password: "",
  remember: false,
});

// 记住登录信息 没用信息就置为空
const admin = reactive({
  account: localStorage.getItem("account") || "",
  password: localStorage.getItem("password") || "",
  rember: localStorage.getItem("rember") == 1 || false,
});

// 登录验证规则
const loginRules = ref({
  username: [{ required: true, message: "请输入账户", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

// 登录
const login = async () => {
  let res = await api.adminLogin({
    username: loginMsg.username,
    password: loginMsg.password,
  });

  if (res.code === 200) {
    // 数据持久化
    store.id = res.id;
    store.username = res.username;
    store.token = res.token;

    await router.push("/dashboard");
    ElMessage({
      message: "登录成功",
      type: "success",
    });
  } else {
    ElMessage({
      message: "登录失败，请检查账号和密码",
      type: "warning",
    });
  }
};
</script>

<style lang="scss" scoped>
.login {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
}
</style>
