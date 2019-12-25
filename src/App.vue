<template>
  <div id="app">
    <img alt="Vue logo" class="logo" src="http://fisco-bcos.org/zh/assets/logo.png" />
    <layout msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import layout from "./components/layout";
export default {
  name: "app",
  components: {
    layout
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.logo {
  background-repeat: no-repeat;
  height: 46px;
}
</style>
