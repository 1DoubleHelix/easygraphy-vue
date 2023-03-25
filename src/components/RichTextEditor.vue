<template lang="">
  <div>
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      style="height: 400px; overflow-y: hidden"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css";
import {
  ref,
  reactive,
  inject,
  onMounted,
  onBeforeUnmount,
  shallowRef,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { userStore } from "../stores/userStore.js";

const store = userStore();

const serverURL = inject("serverURL");
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const toolbarConfig = { excludeKeys: ["uploadVideo"] };
const editorConfig = { placeholder: "请输入内容...", autoFocus: false };
editorConfig.MENU_CONF = {};
editorConfig.MENU_CONF["uploadImage"] = {
  // 10kB以内的图片直接Base64存放在文档中
  base64LimitSize: 10 * 1024,
  server: serverURL + "/upload/images",
  // 上传图片需要验证token
  headers: { Authorization: store.token },
};
editorConfig.MENU_CONF["insertImage"] = {
  // 服务器返回的地址不带http前缀 拼接serverURL
  parseImageSrc: (src) => {
    if (src.indexOf("http") !== 0) {
      return `${serverURL}${src}`;
    }
    return src;
  },
};

const mode = ref("simple");
const valueHtml = ref("");

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:model-value"]);
let initFinished = false;

onMounted(() => {
  setTimeout(() => {
    valueHtml.value = props.modelValue;
    initFinished = true;
  }, 10);
});

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  if (initFinished) {
    emit("update:model-value", valueHtml.value);
  }
};
</script>

<style lang=""></style>
