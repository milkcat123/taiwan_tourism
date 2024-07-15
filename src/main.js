import { createApp } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import App from "./App.vue";
import "./registerServiceWorker";

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(VueAxios, axios).use(vuetify).mount("#app");
