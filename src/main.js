// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import $ from 'jquery';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';

import App from './App';

Vue.use(Vuetify);

Vue.config.productionTip = false;

const api = new Vue({
  data: {
    serverURL: 'http://91.225.131.163',
    user: {
      login: 'test',
    },
    rates: [],
  },
  methods: {
    login: (login, password) => {
      $.post(`${api.serverURL}/login`,
        {
          login,
          password,
        },
        (u) => {
          api.user = u;
          console.log(u);
        });
    },
    updateRates: () => {
      $.get(`${api.serverURL}/rates`,
        {
          token: api.user.token,
        })
        .done((res) => { api.rates = res; })
      ;
    },
    updateWallet: () => {
      $.get(`${api.serverURL}/wallet`,
        {
          token: api.user.token,
          user_id: api.user.id,
        })
        .done((res) => { api.wallet = res; })
      ;
    },
  },
});

api.install = () => {
  Object.defineProperty(Vue.prototype, '$api', {
    get() {
      return api;
    },
  });
};

Vue.use(api);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
