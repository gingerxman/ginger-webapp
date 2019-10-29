import Vue from 'vue';
import App from './App';
import { router } from './router';

import VueCookies from 'vue-cookies'
import VueStorage from 'vue-ls'

Vue.use(VueCookies)
Vue.use(VueStorage)

require('./assets/base.css');

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});
