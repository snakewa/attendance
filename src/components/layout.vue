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
      <b-tab title="用戶授權">
        <tab3 />
      </b-tab>
      <b-tab title="機構驗證出席證明">
        <p>機構驗證出席證明</p>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import tab1 from "./tab1";
import tab2 from "./tab2";
import tab3 from "./tab3";
export default {
  name: "layout",
  props: {
    msg: String
  },
  components: {
    tab1,
    tab2,
    tab3
  },
  methods: {
    refreshUsers() {
      console.log("refreshUsers");
      this.$vars.organizations = this.$store.getAllOrganization();
      this.$vars.pureUsers = this.$store.getAllPureUser();
      this.$root.$data.organizationsOptions = this.convertOptions(
        this.$vars.organizations
      );
      this.$root.$data.pureUsersOptions = this.convertOptions(
        this.$vars.pureUsers
      );
      console.log(
        "this.$root.$data.pureUsersOptions",
        this.$root.$data.pureUsersOptions
      );
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
    console.log("layout", this);
  }
};
</script>