import { createApp } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

// Vuetify
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import vue3GoogleLogin from "vue3-google-login";

import App from "./App.vue";
import "./registerServiceWorker";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi", // This is already the default value - only for display purposes
  },
});

createApp(App)
  .use(VueAxios, axios)
  .use(vuetify)
  .use(vue3GoogleLogin, {
    clientId: process.env.VUE_APP_AUTH_ID,
  })
  .mount("#app");
