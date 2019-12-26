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
  </div>
</template>
<script>
import config from "./../config.js";
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
      endTimeStr: new Date().toTimeString().substr(0, 5)
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
      for (let key in this.$vars.organizations) {
        let org = this.$vars.organizations[key];
        arr.push({ value: org, text: org.name });
      }
      return arr;
    },
    userOptions() {
      var arr = [];
      for (let key in this.$vars.pureUsers) {
        let org = this.$vars.pureUsers[key];
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
          cptId: this.$vars.cptId,
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
          console.log("putCredential", credential);
        });
    }
  },
  watch:{
      $vars(){
          console.log("change $vars");
      }
  },
  created() {
    this.$vars.organizations = this.$store.getAllOrganization();
    this.$vars.pureUsers = this.$store.getAllPureUser();
    console.log(this);
    try {
      this.selectedOrg = this.$vars.organizations[0];
      this.selectedUser = this.$vars.pureUsers[0];
    } catch (e) {}
  }
};
</script>