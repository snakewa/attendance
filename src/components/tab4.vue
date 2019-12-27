<template>
  <div>
    <b-container>
      <b-row>
        <b-col sm="3">
          <label>驗證機構</label>
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
      selectedOrg: this.$root.$data.organizations[0],
      selectedCredential: null,
      selectedUser: this.$root.$data.pureUsers[0]
    };
  }
};
</script>