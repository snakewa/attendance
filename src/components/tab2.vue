<template>
  <div>
    <b-form-select v-model="selectedOrg" :options="orgOptions"></b-form-select>
    <b-container fluid>
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
    </b-container>
    <b-form-select v-model="selectedUser" :options="userOptions"></b-form-select>
    <b-button variant="primary" @click="createCredential">簽發證明</b-button>

    <p>{{attendStartDate}} - {{attendEndDate}}</p>
    <p>{{startDateStr}} {{startTimeStr}}</p>
    <p>{{endDateStr}} {{endTimeStr}}</p>
  </div>
</template>
<script>
import config from "./../config.js";
export default {
  data() {
    return {
      selectedOrg: null,
      selectedUser: null,
      organizations: null,
      pureUsers: null,
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
      let arr = [];
      for (let key in this.organizations) {
        let org = this.organizations[key];
        arr.push({ value: org, text: org.name });
      }
      return arr;
    },
    userOptions() {
      let arr = [];
      for (let key in this.pureUsers) {
        let org = this.pureUsers[key];
        arr.push({ value: org, text: org.name });
      }
      return arr;
    }
  },
  methods: {
    createCredential() {
      var _this = this;
      this.$axios
        .post(config.fisco_bcos.url, {
          functionArg: {
            issuer: this.selectedOrg.weId,
            cptId: this.$cptId,
            expirationDate: "2500-04-18T21:12:33Z",
            claim: {
              weid: "did:weid:0x5774e89d8e7fc8ffc1b7fff4b1019a22ac7140fb",
              receiver: "did:weid:0x7ed16eca3b0737227bc986dd0f2851f644cf4754",
              content: "b1016358-cf72-42be-9f4b-a18fca610fca"
            }
          },
          transactionArg: {
            invokerWeId: "did:weid:0x5774e89d8e7fc8ffc1b7fff4b1019a22ac7140fb"
          },
          v: "1.0.0",
          functionName: "createCredential"
        })
        .then(function(response) {
          
        });
    }
  },
  created() {
    this.organizations = this.$store.getAllOrganization();
    this.pureUsers = this.$store.getAllPureUser();
    try {
      this.selectedOrg = this.organizations[0];
      this.selectedUser = this.pureUsers[0];
    } catch (e) {}
  }
};
</script>