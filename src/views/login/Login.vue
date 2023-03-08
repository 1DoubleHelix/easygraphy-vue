<template>
  <div class="login-container">
    <el-card class="login-card">
      <el-tabs v-model="activeName" class="login-tabs" @tab-click="clickTab">
        <el-tab-pane label="登录" name="first">
          <div class="login">
            <el-form :model="loginMsg" :rules="loginRules">
              <el-form-item prop="username">
                <el-input
                  v-model="loginMsg.username"
                  placeholder="请输入用户名"
                />
              </el-form-item>
              <el-form-item prop="password">
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
            >
              <el-form-item prop="username">
                <el-input
                  v-model="registerMsg.username"
                  placeholder="请输入用户名"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="registerMsg.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                />
              </el-form-item>
              <el-form-item prop="rePassword">
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
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { userStore } from "../../stores/userStore.js";

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
  username: [{ validator: checkUsername, trigger: "blur" }],
  password: [{ validator: checkPassword, trigger: "blur" }],
  rePassword: [{ validator: checkRePassword, trigger: "blur" }],
});

// 登录
const login = async () => {
  let req = await axios.post("/user/login", {
    username: loginMsg.username,
    password: loginMsg.password,
  });
  console.log(req);

  if (req.data.code === 200) {
    // 数据持久化
    store.id = req.data.id;
    store.username = req.data.username;
    store.nickname = req.data.nickname;
    store.token = req.data.token;

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
  let req = await axios.post("/user/register", {
    username: registerMsg.username,
    password: registerMsg.password,
  });

  if (req.data.code === 200) {
    // 直接登录
    req = await axios.post("/user/login", {
      username: registerMsg.username,
      password: registerMsg.password,
    });

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
const clickTab = () => {
  // 清空密码
};

// 表单验证
</script>

<style lang="scss" scoped>
.login-container {
  width: 500px;
  margin: 50px auto;

  .login-card {
    .el-button {
      width: 100px;
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
</style>
