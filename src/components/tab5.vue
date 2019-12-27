<template>
  <div>
    <b-form-checkbox
      id="checkbox-3"
      v-model="type_verify2"
      name="checkbox-3"
      value="input"
      unchecked-value="qr"
    >手動輸入證明</b-form-checkbox>

    <b-container v-if="type_verify2=='qr'" class="mb-3">
      <b-row>
        <p class="error">{{ error }}</p>
        <qrcode-stream v-if="!error" @decode="onDecode" @init="onInit" />
        <qrcode-drop-zone @detect="onDetect" @dragover="onDragOver" @init="logErrors">
          <div class="drop-area" :class="{ 'dragover': dragover }">拖入証明QR</div>
        </qrcode-drop-zone>
        <b-form-textarea v-model="result" placeholder rows="3" max-rows="6"></b-form-textarea>
      </b-row>
    </b-container>
    <b-container v-if="type_verify2=='input'" class="mb-3">
      <b-row>
        <b-form-textarea v-model="credentialJson" placeholder rows="3" max-rows="6"></b-form-textarea>
        <b-button href="#" variant="primary" @click="verify(JSON.parse(credentialJson))">驗證</b-button>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { QrcodeStream,QrcodeDropZone } from "vue-qrcode-reader";

import config from "./../config.js";
export default {
  components: { QrcodeStream, QrcodeDropZone },

  data() {
    return {
      type_verify2: "qr",
      credentialJson: "",
      result: "",
      error: "",
      dragover:false
    };
  },
  methods: {
    verify(credential) {
      console.log("verify credential", credential);
      if(typeof credential == "string"){
        try {
          credential = JSON.parse(credential);
        } catch (e) {
          this.$bvModal.msgBoxOk("無效的出席證明", {
            title: "失敗",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            centered: true
          });
          return false;
        }
      }
      
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

          // <b-card
          //   :title="$store.getUser(c.claim.receiver).name"
          //   tag="article"
          //   style="max-width:500px"
          //   class="mt-2"
          // >
          //   <b-card-text>
          //     
          //   </b-card-text>

          //   <b-button href="#" variant="primary" @click="verify(c)">驗證</b-button>
          // </b-card>

          if (result){
            const h = _this.$createElement

            let c = credential;
            let msg = `
            <p>地點： ${_this.$store.getUser(c.issuer).name}</p>
              <p>內容: ${c.claim.content}</p>
               <p>開始時間: ${c.claim.starttime}</p>
              <p>結束時間: ${c.claim.endtime}</p>
               <small>證書UUID：${c.id}</small>
            `
            const msgVNode = h('div', { domProps: { innerHTML: msg } })

            _this.$bvModal.msgBoxOk([msgVNode], {
              title: "驗證成功",
              size: "sm",
              buttonSize: "sm",
              okVariant: "success",
              headerClass: "p-2 border-bottom-0",
              footerClass: "p-2 border-top-0",
              centered: true
            });
          }else
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
    },
    onDragOver(isDraggingOver) {
      this.dragover = isDraggingOver;
    },
    async onDetect (promise) {
      try {
        const { content } = await promise

        this.result = content
        this.error = null
        this.verify(content);
      } catch (error) {
        if (error.name === 'DropImageFetchError') {
          this.error = 'Sorry, you can\'t load cross-origin images :/'
        } else if (error.name === 'DropImageDecodeError') {
          this.error = 'Ok, that\'s not an image. That can\'t be decoded.'
        } else {
          this.error = 'Ups, what kind of error is this?! ' + error.message
        }
      }
    },
    onDecode(result) {
      this.error = null
      this.result = result;
      this.verify(result);
    },
    logErrors(promise) {
      promise.catch(console.error);
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    }
  }
};
</script>