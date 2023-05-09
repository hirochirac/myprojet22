import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Bootstrap from 'bootstrap'
import BootstrapVue from 'bootstrap-vue'
import axios, { Axios } from 'axios'
import { VueAxios } from 'axios-vue'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'

import 'E:/vuejs/myprojet22/node_modules/bootstrap/dist/css/bootstrap.css'
import 'E:/vuejs/myprojet22/node_modules/bootstrap/dist/js/bootstrap'

Vue.use(BootstrapVue)

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/fr.json'


Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule],
    messages: messages[rule]
  })
})

//Vue.use(axios)
//Vue.use(VueAxios)

axios.defaults.baseURL = 'http://localhost:9090'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
