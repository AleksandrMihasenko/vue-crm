import Vue from "vue";
import Vuelidate from "vuelidate";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import messagePlugin from "@/utils/message.plugin";
import "./registerServiceWorker";

import firebase from "firebase";
import "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false;

Vue.use(messagePlugin);
Vue.use(Vuelidate);

firebase.initializeApp({
  apiKey: "AIzaSyDV2MLZKQxoDAC3vPEdPMFroJZWYkqDoqg",
  authDomain: "vue-crm-dd090.firebaseapp.com",
  projectId: "vue-crm-dd090",
  storageBucket: "vue-crm-dd090.appspot.com",
  messagingSenderId: "805247621332",
  appId: "1:805247621332:web:81bf6f915df2ff82fac341"
});

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
