import { createApp } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

// Vuetify
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "./assets/rwd.scss";

import App from "./App.vue";
import "./registerServiceWorker";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi", // This is already the default value - only for display purposes
  },
});

createApp(App).use(VueAxios, axios).use(vuetify).mount("#app");
