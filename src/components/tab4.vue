<template>
  <div>


    <b-container class="mb-3">
      <b-row>
        <b-col sm="3">
          <label>驗證機構</label>
        </b-col>
        <b-col sm="9">
          <b-form-select
            v-model="selectedOrg"
            :options="$root.$data.organizationsOptions"
            @change="changeOrg"
          ></b-form-select>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-for="c in orgC" v-bind:key="c.id">
          <b-card
            :title="$store.getUser(c.claim.receiver).name"
            tag="article"
            style="max-width:500px"
            class="mt-2"
          >
            <b-card-text>
              <p>地點： {{$store.getUser(c.issuer).name}}</p>
              <p>內容: {{c.claim.content}}</p>
              <p>開始時間: {{c.claim.starttime}}</p>
              <p>結束時間: {{c.claim.endtime}}</p>
              <small>證書UUID：{{c.id}}</small>
            </b-card-text>

            <b-button href="#" variant="primary" @click="verify(c)">驗證</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
   
  </div>
</template>
<script>
import config from "./../config.js";
export default {
  data() {
    return {
      selectedOrg: this.$root.$data.organizations[0],
      orgC: [],
    };
  },
  methods: {
    changeOrg() {
      if (this.selectedOrg == undefined) return;
      this.orgC = this.$store.getAuthCredentials(this.selectedOrg.weId);
    },
    verify(credential) {
      console.log("verify credential", credential);
      var _this = this;
      let requestData = {
        functionArg: credential,
        transactionArg: {},
        v: "1.0.0",
        functionName: "verifyCredential"
      };
      console.log("verifyCredential requestData", requestData);
      this.$axios
        .post(config.fisco_bcos.url, requestData)
        .then(function(response) {
          console.log(response);
          let result = response.data.respBody;
          if (result)
            _this.$bvModal.msgBoxOk("驗證成功", {
              title: "結果",
              size: "sm",
              buttonSize: "sm",
              okVariant: "success",
              headerClass: "p-2 border-bottom-0",
              footerClass: "p-2 border-top-0",
              centered: true
            });
          else
            _this.$bvModal.msgBoxOk("驗證失敗", {
              title: "結果",
              size: "sm",
              buttonSize: "sm",
              okVariant: "danger",
              headerClass: "p-2 border-bottom-0",
              footerClass: "p-2 border-top-0",
              centered: true
            });
        });
    }
  }
};
</script>