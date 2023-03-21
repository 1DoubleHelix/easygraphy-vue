<template>
  <div>

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

moment.locale("zh-cn", momentCN);

const router = useRouter();
const route = useRoute();
</script>

<style lang="scss" scoped>

</style>