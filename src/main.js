import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import store from './storage.js'
import axios from 'axios'

//global variable
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.prototype.$store=store;

var vm=new Vue({
  render: h => h(App),
}).$mount('#app')
window.vm=vm;
