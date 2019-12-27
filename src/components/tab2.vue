<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col sm="3">
          <label>簽發機構</label>
        </b-col>
        <b-col sm="9">
          <b-form-select v-model="selectedOrg" :options="$root.$data.organizationsOptions"></b-form-select>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="3">
          <label>開始日期</label>
        </b-col>
        <b-col sm="9">
          <b-form-input type="date" v-model="startDateStr"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="3">
          <label>開始時間</label>
        </b-col>
        <b-col sm="9">
          <b-form-input type="time" v-model="startTimeStr"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="3">
          <label>結束日期</label>
        </b-col>
        <b-col sm="9">
          <b-form-input type="date" v-model="endDateStr"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="3">
          <label>結束時間</label>
        </b-col>
        <b-col sm="9">
          <b-form-input type="time" v-model="endTimeStr"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="3">
          <label>參與人</label>
        </b-col>
        <b-col sm="9">
          <b-form-select v-model="selectedUser" :options="$root.$data.pureUsersOptions"></b-form-select>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="3">
          <label>活動內容</label>
        </b-col>
        <b-col sm="9">
          <b-input v-model="content"></b-input>
        </b-col>
      </b-row>
    </b-container>

    <b-button variant="primary" @click="createCredential">簽發證明</b-button>
<div v-if="credentialJson">
  <b-container class="bv-example-row">
  <b-row>
    <b-col class="add_padding"> <b-form-textarea
      id="textarea"
      v-model="credentialJson"
      placeholder=""
      rows="3"
      max-rows="6"
      
    ></b-form-textarea>
    <qrcode :value="credentialJson" :options="{ width: 500 }"></qrcode>

    
    </b-col> 
  </b-row>
</b-container>
  
    </div>


    
  </div>
</template>
<script>
import config from "./../config.js";
import Vue from 'vue';
import VueQrcode from '@chenfengyuan/vue-qrcode';
Vue.component(VueQrcode.name, VueQrcode);

export default {
  data() {
    return {
      selectedOrg: null,
      selectedUser: null,
      content: "參加考試",
      startDateStr:
        new Date().getFullYear() +
        "-" +
        ("0" + (new Date().getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + new Date().getDate()).slice(-2),
      startTimeStr: new Date().toTimeString().substr(0, 5),
      endDateStr:
        new Date().getFullYear() +
        "-" +
        ("0" + (new Date().getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + new Date().getDate()).slice(-2),
      endTimeStr: new Date().toTimeString().substr(0, 5),
      credentialJson:''
    };
  },
  computed: {
    attendStartDate() {
      return new Date(this.startDateStr + " " + this.startTimeStr);
    },
    attendEndDate() {
      return new Date(this.endDateStr + " " + this.endTimeStr);
    },
    orgOptions() {
      var arr = [];
      for (let key in this.$root.$data.organizations) {
        let org = this.$root.$data.organizations[key];
        arr.push({ value: org, text: org.name });
      }
      return arr;
    },
    userOptions() {
      var arr = [];
      for (let key in this.$root.$data.pureUsers) {
        let org = this.$root.$data.pureUsers[key];
        arr.push({ value: org, text: org.name });
      }
      return arr;
    }
    
  },
  methods: {
    convertOptions(obj) {
      var arr = [];
      for (let key in obj) {
        let item = obj[key];
        arr.push({ value: item, text: item.name });
      }
      return arr;
    },
    createCredential() {
      var _this = this;
      var today = new Date();
      var expirationDate = new Date(
        today.getFullYear() + 2,
        today.getMonth(),
        today.getDate()
      );
      let requestData = {
        functionArg: {
          issuer: this.selectedOrg.weId,
          cptId: this.$root.$data.cptId,
          expirationDate: expirationDate.toISOString().replace(".000Z", "Z"),
          claim: {
            weid: this.selectedOrg.weId,
            receiver: this.selectedUser.weId,
            starttime: this.attendStartDate,
            endtime: this.attendEndDate,
            content: this.content
          }
        },
        transactionArg: {
          invokerWeId: this.selectedOrg.weId
        },
        v: "1.0.0",
        functionName: "createCredential"
      };
      console.log("createCredential requestData", requestData);
      this.$axios
        .post(config.fisco_bcos.url, requestData)
        .then(function(response) {
          let credential = response.data.respBody;
          _this.$store.putCredential(credential);
          _this.$data.credentialJson = JSON.stringify(credential);
          _this.$bvModal.msgBoxOk("出席證明簽發成功", {
            title: "結果",
            size: "sm",
            buttonSize: "sm",
            okVariant: "success",
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            centered: true
          });
        });
    }
  },
  created() {
    this.$root.$data.organizations = this.$store.getAllOrganization();
    this.$root.$data.pureUsers = this.$store.getAllPureUser();
    //window.$store=this.$root.$store
    try {
      this.selectedOrg = this.$root.$data.organizations[0];
      this.selectedUser = this.$root.$data.pureUsers[0];
    } catch (e) {}
  }
};
</script>