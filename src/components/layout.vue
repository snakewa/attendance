<template>
  <div>
    <p>出席證明應用</p>
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
    </b-tabs>
  </div>
</template>
<script>
import tab1 from "./tab1";
import tab2 from "./tab2";
import tab3 from "./tab3";
import tab4 from "./tab4";
export default {
  name: "layout",
  props: {
    msg: String
  },
  components: {
    tab1,
    tab2,
    tab3,
    tab4
  },
  methods: {
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
  }
};
</script>