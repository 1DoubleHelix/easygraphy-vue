<template>
  <div>
    跨页面获取store：
  </div>
</template>

<script setup>
import {ref, reactive, inject, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import {ElMessage} from 'element-plus'
import {userStore} from "../stores/userStore.js";

const router = useRouter();
const route = useRoute();
const store = userStore()
const axios = inject("axios");

onMounted(() => {
  console.log(store.token)
  console.log(localStorage.getItem("token"))
})


</script>

<style lang="scss" scoped>

</style>