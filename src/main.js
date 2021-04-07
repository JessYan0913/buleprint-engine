import "babel-polyfill"; // 解决Ie9
import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.config.file;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
