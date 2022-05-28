import { createApp, reactive } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const app = createApp(App);
const flashes = reactive(['test1', 'test2'])
app.provide('flashes', flashes)

app.use(router);

app.mount("#app");
