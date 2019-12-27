<template>
  <div>
    <p>DID 註冊</p>
    <b-container class="mb-5">
      <b-row>
        <b-col sm="3">
          <label>名稱:</label>
        </b-col>
        <b-col sm="9">
          <b-form-input id="name" v-model="name" required></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="3">類型</b-col>
        <b-col sm="9" class="text-left">
          <b-form-group>
            <b-form-radio-group
              id="btn-radios-2"
              v-model="userType"
              :options="userTypes"
              buttons
              button-variant="outline-primary"
              size="lg"
              name="radio-btn-outline"
            ></b-form-radio-group>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>
    <b-button variant="primary" @click="registWeId">註冊</b-button>

    <b-table striped hover :items="items" small></b-table>
  </div>
</template>
<script>
import config from "./../config.js";
export default {
  data() {
    return {
      blockNumber:123,
      name: "",
      weId: null,
      items: this.$store.getAllUsers(),
      userType: "user",
      userTypes: [
        { text: "普通帳號", value: "user" },
        { text: "機構", value: "organization" }
      ]
    };
  },
  created () {
  },
  computed: {},
  methods: {
    registWeId() {
      var _this = this;
      this.$axios
        .post(config.fisco_bcos.url, {
          functionArg: {},
          transactionArg: {},
          v: "1.0.0",
          functionName: "createWeId"
        })
        .then(function(response) {
          console.log("registWeId ",response)
          _this.weId = response.data.respBody;
          let user = {
              weId: _this.weId,
            name: _this.name,
            userType: _this.userType
          };
          if (_this.userType == "organization") {
            _this.registerAuthorityIssuer(user);
          } else {
            _this.$store.putUser(user.weId, user);
            _this.items = _this.$store.getAllUsers();
          }
        });
    },
    registerAuthorityIssuer(user) {
      var _this = this;
      this.$axios
        .post(config.fisco_bcos.url, {
          functionArg: {
            weId: user.weId,
            name: user.name+"_"+user.weId.substr(30)
          },
          transactionArg: {
            invokerWeId: "ecdsa_key"
          },
          v: "1.0.0",
          functionName: "registerAuthorityIssuer"
        })
        .then(function(response) {
          console.log("registerAuthorityIssuer",response)
          let result = response.data.respBody;
          if(result==true){
            _this.$store.putUser(user.weId, user);
            _this.items = _this.$store.getAllUsers();
          }
        });
    }
  }
};
</script>