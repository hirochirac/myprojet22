import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

import axios from 'axios'
//import VueAxios from 'vue-axios'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/fr.json';

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule],
    message: messages[rule]
  });
});

Vue.use(axios)

axios.defaults.baseURL = 'http://localhost:9090'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')