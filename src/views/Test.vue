<template>
  <div class="try">演练场，射就完了</div>

</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { userStore } from "../stores/userStore.js";
import * as api from "../api/index.js";

const router = useRouter();
const route = useRoute();
const store = userStore();
const axios = inject("axios");

const slider = ref([0, 5000]);

onMounted(() => {
  console.log(store.token);
  console.log(localStorage.getItem("token"));
});

const testAxios = () => {
  let res = api.test();
  console.log(res);
};
</script>

<style lang="scss" scoped>
.try {
  margin: 0 auto;
  text-align: center;
}

.test {
  margin: 0 auto;
  width: 800px;
  background-color: #eeeeee;
}
</style>
