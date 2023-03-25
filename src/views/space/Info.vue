<template>
  <div class="user-info">
    <div class="avatar">
      <img src="" alt="" />
    </div>
    <div class="id">{{ store.id }}</div>
    <div class="username">{{ store.username }}</div>
    <div class="nickname">{{ store.nickname }}</div>
    <div class="email">{{ store.email }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "../../api/index.js";
import { userStore } from "../../stores/userStore.js";

const router = useRouter();
const route = useRoute();
const store = userStore();

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
