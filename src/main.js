// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

const app = createApp(App);
app.use(VueAxios, axios);
app.component("font-awesome-icon", FontAwesomeIcon);
app.provide("axios", app.config.globalProperties.axios); // provide 'axios'
app.mount("#app");
