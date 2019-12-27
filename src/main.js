import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import store from './storage.js'
import axios from 'axios'
import config from "./config.js";
//global variable
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.prototype.$store = store;

let admin = store.getAdmin();
let cptId = store.get("cptId");
console.log("admin", admin);
if (admin == null)
  axios.post(config.fisco_bcos.url, {
    functionArg: {},
    transactionArg: {},
    v: "1.0.0",
    functionName: "createWeId"
  }).then(function (response) {
    console.log("admin createWeId", response)
    let weId = response.data.respBody;
    admin = {
      weId: weId,
      name: "admin",
      userType: "admin"
    };
    store.putUser(admin.weId, admin);
    axios.post(config.fisco_bcos.url, {
      "functionArg": {
        "weId": weId,
        "cptJsonSchema": {
          "weid": "Delegator WeID",
          "receiver": "Receiver WeID",
          "starttime": {
            "format": "date-time",
            "type": "string",
            "description": "Event starting time",
            "required": true
          },
          "endtime": {
            "format": "date-time",
            "type": "string",
            "description": "Event ending time"
          },
          "content": "Event content"
        }
      },
      "transactionArg": {
        "invokerWeId": weId
      },
      "v": "1.0.0",
      "functionName": "registerCpt"
    }).then(function (response) {
      console.log("cptJsonSchema ", response)
      cptId = response.data.respBody.cptId;
      store.set("cptId", cptId);
      location.reload();
    });
  });

var vm = new Vue({
  data:{
    admin,
    cptId,
    pureUsers: [], 
    organizations: [],
    pureUsersOptions:[],
    organizationsOptions:[],
    credentials:[],
    credentialsOptions:[]
  },
  render: h => h(App),
}).$mount('#app')
window.vm = vm;
