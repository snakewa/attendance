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
          <b-form-select v-model="selectedCredential" :options="$root.$data.credentialsOptions"></b-form-select>
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
    <b-button variant="primary" class="mt-3" @click="authorize">授權</b-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedOrg: this.$root.$data.organizations[0],
      selectedCredential: null,
      selectedUser: this.$root.$data.pureUsers[0]
    };
  },
  methods: {
    changeUser() {
      if (this.selectedUser == undefined) return;
      this.$root.$data.credentials = this.$store.getCredentials(
        this.selectedUser.weId
      );
      this.$root.$data.credentialsOptions = this.convertOptions(
        this.$root.$data.credentials
      );
      this.selectedCredential =
        this.$root.$data.credentials == null
          ? null
          : this.$root.$data.credentials[0];
    },
    convertOptions(obj) {
      var arr = [];
      if (obj == null) return arr;
      for (let key in obj) {
        let item = obj[key];
        arr.push({
          value: item,
          text: this.$store.getUser(item.issuer).name + "-" + item.claim.content
        });
      }
      return arr;
    },
    authorize() {
      let orgC = this.$store.getAuthCredentials(this.selectedOrg.weId);
      for (let i in orgC) {
        if (orgC[i].id == this.selectedCredential.id) {
          this.$bvModal.msgBoxOk("已經授權", {
            title: "失敗",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            centered: true
          });
          return;
        }
      }
      this.$store.putAuthCredentials(
        this.selectedOrg.weId,
        this.selectedCredential
      );
      this.$bvModal.msgBoxOk("授權成功", {
        title: "成功",
        size: "sm",
        buttonSize: "sm",
        okVariant: "success",
        headerClass: "p-2 border-bottom-0",
        footerClass: "p-2 border-top-0",
        centered: true
      });
    }
  },
  created() {
    this.changeUser();
  }
};
</script>