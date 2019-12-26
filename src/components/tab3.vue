<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col sm="3">
          <label>當前帳戶</label>
        </b-col>
        <b-col sm="9">
          <b-form-select
            v-model="selectedUser"
            :options="$root.$data.pureUsersOptions"
            @change="changeUser"
          ></b-form-select>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="3">
          <label>證書列表</label>
        </b-col>
        <b-col sm="9">
          <b-form-select v-model="selectedCredential" :options="credentialsOptions"></b-form-select>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="3">
          <label>授權驗證機構</label>
        </b-col>
        <b-col sm="9">
          <b-form-select v-model="selectedOrg" :options="$root.$data.organizationsOptions"></b-form-select>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedOrg: null,
      selectedCredential: null,
      selectedUser: null,
      credentials: null,
      credentialsOptions: []
    };
  },
  methods: {
    changeUser() {
      this.credentials=this.$store.getCredentials(this.selectedUser.weId);
      console.log("this.credentials",this.credentials);
      this.credentialsOptions=this.convertOptions(this.credentials);
    },
    convertOptions(obj) {
      var arr = [];
      for (let key in obj) {
        let item = obj[key];
        
        arr.push({ value: item, text: item.issuer });
      }
      return arr;
    }
  }
};
</script>