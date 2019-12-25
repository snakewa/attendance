<template>
  <div>
    <p>出席證明應用
    </p>
    <b-tabs content-class="mt-3">
      <b-tab title="DID註冊" active>
        <tab1/>
      </b-tab>
      <b-tab title="機構頒發出席證明">
        <p>機構頒發出席證明
        </p>
      </b-tab>
      <b-tab title="機構驗證出席證明">
        <p>機構驗證出席證明</p>
      </b-tab>
      <b-tab title="用戶授權">
        <p>用戶授權
        </p>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import tab1 from "./tab1";
export default {
  name: 'layout',
  props: {
    msg: String
  },
  components: {
    tab1
  }
}
</script>