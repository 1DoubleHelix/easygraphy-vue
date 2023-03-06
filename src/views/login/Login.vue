<template>
  <div class="login-container">
    <el-card class="login-card">
      <el-tabs v-model="activeName" class="login-tabs" @tab-click="clickTab">
        <el-tab-pane label="登录" name="first">
          <div class="login">
            <div class="input">
              <el-input v-model="inputUsername" placeholder="Please input"/>
            </div>
            <div class="input">
              <el-input
                  v-model="inputPassword"
                  type="password"
                  placeholder="Please input password"
                  show-password
              />
            </div>
            <el-button>登录</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="注册" name="second">
          <div class="register">
            <el-input v-model="inputUsername" placeholder="Please input"/>
            <el-input
                v-model="inputPassword"
                type="password"
                placeholder="Please input password"
                show-password
            />
            <el-input
                v-model="confirmPassword"
                type="password"
                placeholder="Please input password"
                show-password
            />
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-card>
  </div>
</template>

<script setup>
import {ref, reactive, inject} from "vue";
import {AdminStore} from "../../stores/AdminStores";
import {useRouter, useRoute} from "vue-router";

const router = useRouter();
const route = useRoute();
const adminStore = AdminStore();

const inputUsername = ref('')
const inputPassword = ref('')
const confirmPassword = ref('')

const axios = inject("axios");

const activeName = ref('first')

const clickTab = () => {
  inputUsername.value = ""
  inputPassword.value = ""
  confirmPassword.value = ""
}

</script>

<style lang="scss" scoped>
.login-container {
  width: 500px;
  margin: 50px auto;

  .login-card {


    .login {

      .input {
        margin-bottom: 20px;
      }

      .el-button {
        width: 100px;
      }
    }

    .register {
      .el-input {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
