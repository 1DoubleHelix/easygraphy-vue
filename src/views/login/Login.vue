<template>
  <div class="login">
    <div class="login-container">
      <el-card class="login-card">
        <el-tabs v-model="activeName" class="login-tabs">
          <el-tab-pane label="登录" name="first">
            <div class="login">
              <el-form
                :model="loginMsg"
                :rules="loginRules"
                label-position="top"
              >
                <el-form-item prop="username" label="用户名:">
                  <el-input
                    v-model="loginMsg.username"
                    placeholder="请输入用户名"
                  />
                </el-form-item>
                <el-form-item prop="password" label="密码:">
                  <el-input
                    v-model="loginMsg.password"
                    type="password"
                    placeholder="请输入密码"
                    show-password
                  />
                </el-form-item>
                <el-checkbox
                  v-model="loginMsg.remember"
                  label="记住密码"
                ></el-checkbox>
              </el-form>
              <el-button type="primary" @click="login">登录</el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="注册" name="second">
            <div class="register">
              <el-form
                ref="registerFormRef"
                :model="registerMsg"
                :rules="registerRules"
                label-position="top"
              >
                <el-form-item prop="username" label="用户名:">
                  <el-input
                    v-model="registerMsg.username"
                    placeholder="请输入用户名"
                  />
                </el-form-item>
                <el-form-item prop="nickname" label="昵称:">
                  <el-input
                    v-model="registerMsg.nickname"
                    placeholder="请输入昵称"
                  />
                </el-form-item>
                <el-form-item prop="password" label="密码:">
                  <el-input
                    v-model="registerMsg.password"
                    type="password"
                    placeholder="请输入密码"
                    show-password
                  />
                </el-form-item>
                <el-form-item prop="rePassword" label="确认密码">
                  <el-input
                    v-model="registerMsg.rePassword"
                    type="password"
                    placeholder="请再次输入密码"
                    show-password
                  />
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="register">注册</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
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
const axios = inject("axios");

const activeName = ref("first");

// 登录信息
const loginMsg = reactive({
  username: "",
  password: "",
  remember: false,
});
// 注册信息
const registerMsg = reactive({
  username: "",
  password: "",
  rePassword: "",
  nickname: "",
});
// 登录验证规则
const loginRules = ref({
  username: [{ required: true, message: "请输入账户", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

// 注册验证规则
const checkUsername = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入用户名"));
  } else {
    value.length < 5 ? callback(new Error("账号不能小于5位")) : callback();
  }
};
const checkPassword = (rule, value, callback) => {
  if (value.length < 8) {
    callback(new Error("密码长度至少8位"));
  } else {
    callback();
  }
};
const checkRePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请重复输入密码"));
  } else {
    value !== registerMsg.password
      ? callback(new Error("密码不一致"))
      : callback();
  }
};
const registerRules = ref({
  username: [{ required: true, validator: checkUsername, trigger: "blur" }],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  password: [{ required: true, validator: checkPassword, trigger: "blur" }],
  rePassword: [{ required: true, validator: checkRePassword, trigger: "blur" }],
});

// 登录
const login = async () => {
  let req = await api.login({
    username: loginMsg.username,
    password: loginMsg.password,
  });

  if (req.code === 200) {
    // 数据持久化
    store.id = req.id;
    store.username = req.username;
    store.nickname = req.nickname;
    store.email = req.email;
    store.token = req.token;

    // if (loginMsg.remember) {
    //   // 保存账号密码
    // }
    await router.push("/home");
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

// 注册
const register = async () => {
  let req = await api.register({
    username: registerMsg.username,
    password: registerMsg.password,
  });

  if (req.code === 200) {
    // 注册成功后直接登录
    req = await api.login({
      username: registerMsg.username,
      password: registerMsg.password,
    });
    // 数据持久化
    store.id = req.id;
    store.username = req.username;
    store.nickname = req.nickname;
    store.email = rerq.email;
    store.token = req.token;

    // 这里拿到token
    console.log(req);

    ElMessage({
      message: "注册成功",
      type: "success",
    });
    await router.push("/home");
  } else {
    ElMessage({
      message: "注册失败",
      type: "warning",
    });
  }
};

// 表单验证
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  .login-container {
    width: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 20%);
    .login-card {
      height: 480px;
      .el-button {
        width: 100%;
        margin-top: 20px;
      }

      .login {
        .input {
          margin-bottom: 20px;
        }
      }

      .register {
        .input {
          margin-bottom: 20px;
        }
      }
    }
  }
}
.login::after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100vh;
  left: 0;
  top: -60px;
  background-image: url(@/assets/picture/03.jpg);
  background-size: cover;
  z-index: -1;
}
</style>
