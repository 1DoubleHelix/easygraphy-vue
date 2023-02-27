<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>Installed CLI Plugins</h3>
    <h3>Essential Links</h3>
    <h3>Ecosystem</h3>

  </div>
</template>

<script>
// 这里导出 外面做导入
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
