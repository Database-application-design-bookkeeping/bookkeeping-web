import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from 'axios'
import _ from 'lodash'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App);

axios.interceptors.request.use(function (request) {
    let token = localStorage.getItem("token");
    if (token) {
        request.headers.Authorization = token;
    }
    return request
}, async function (error) {
    return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
    if (response.data.code === 401) {
        store.commit("delToken")
    }
    return response
}, async function (error) {
    return Promise.reject(error)
})
axios.defaults.baseURL = 'https://jizhang.hardews.cn/';
app.use(ElementPlus)
app.use(_);
app.use(store);
app.use(router);
app.mount("#app");