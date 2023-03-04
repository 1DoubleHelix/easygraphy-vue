<template>
  <router-view></router-view>
</template>

<script setup>
import {ref, reactive, inject, onMounted, computed} from "vue";
import {useRouter, useRoute} from "vue-router";

const router = useRouter();
const route = useRoute();


onMounted(()=>{

})

</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}

</style>
