<template>
  <div>
    <p>出席證明應用</p>
    <p>block height:{{blockNumber}}</p>
    <b-tabs content-class="mt-3">
      <b-tab title="DID註冊" active>
        <tab1 />
      </b-tab>
      <b-tab title="機構頒發出席證明" @click="refreshUsers">
        <tab2 />
      </b-tab>
      <b-tab title="用戶授權" @click="refreshUsers">
        <tab3 ref="tab3" />
      </b-tab>
      <b-tab title="機構驗證出席證明" @click="refreshUsers">
        <tab4 ref="tab4" />
      </b-tab>
      <b-tab title="鏈下證明驗證" @click="refreshUsers">
        <tab5 ref="tab5" />
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import tab1 from "./tab1";
import tab2 from "./tab2";
import tab3 from "./tab3";
import tab4 from "./tab4";
import tab5 from "./tab5";
import config from "./../config.js";

export default {
  name: "layout",
  props: {
    msg: String
  },
  components: {
    tab1,
    tab2,
    tab3,
    tab4,
    tab5
  },
  data(){
    return {'blockNumber':'-'}  
  },
  methods: {
    fetchBlockHeight(){
      let _this = this
      this.$axios
        .post(config.fisco_bcos.jsonrpc_url, 
         {"jsonrpc":"2.0","method":"getBlockNumber","params":[1],"id":1},{timeout: 1500}
        )
        .then(function(response) {
          //console.log("getBlockNumber",response)
          if(response.data){
            _this.$data.blockNumber = parseInt(response.data.result,16)
          }
          
        });
    },
    refreshUsers() {
      this.$root.$data.organizations = this.$store.getAllOrganization();
      this.$root.$data.pureUsers = this.$store.getAllPureUser();
      this.$root.$data.organizationsOptions = this.convertOptions(
        this.$root.$data.organizations
      );
      this.$root.$data.pureUsersOptions = this.convertOptions(
        this.$root.$data.pureUsers
      );
      this.$refs.tab3.changeUser();
      this.$refs.tab4.changeOrg();
    },
    convertOptions(obj) {
      var arr = [];
      for (let key in obj) {
        let item = obj[key];
        arr.push({ value: item, text: item.name });
      }
      return arr;
    }
  },
  created() {
      if(config.fisco_bcos.jsonrpc_url){
        this.fetchBlockHeight();
        this.timer = setInterval(this.fetchBlockHeight, 1000)
      }
  }
};
</script>