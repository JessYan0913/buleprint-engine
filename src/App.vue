<template>
  <div id="app">
    <ThreeView />
  </div>
</template>

<script>
import ThreeView from "./components/ThreeView.vue";

export default {
  name: "app",
  components: {
    ThreeView
  }
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

#app {
  font-family: Arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>