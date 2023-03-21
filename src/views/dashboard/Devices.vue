<template>
  <div>
    <n-tabs v-model:value="activeTab" type="line">
      <n-tab-pane name="camera"></n-tab-pane>
      <n-tab-pane name="lens"></n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import RichTextEditor from "../../components/RichTextEditor.vue";
import * as api from "../../api/index.js";

const router = useRouter();
const route = useRoute();

const activeTab = ref("camera");
</script>

<style lang="scss" scoped></style>
