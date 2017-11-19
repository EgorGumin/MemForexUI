/* eslint-disable linebreak-style,object-shorthand,prefer-template,quotes,no-param-reassign */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import $ from 'jquery';
import randomColor from 'randomcolor';

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
    wallet: [],
    rates: [],
    chartRates: {
      labels: [],
      datasets: [],
    },
    colors: [],
    datacollection: {
      labels: ['1', '2'],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: randomColor(),
          data: [1, 1],
        }, {
          label: 'Data One',
          backgroundColor: randomColor(),
          data: [2, 3],
        },
      ],
    },
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
          api.updateRates();
          api.updateChartRates();
          api.updateWallet();
        });
    },
    pay: (fromTagId, toTagId, quantity) => {
      $.post(`${api.serverURL}/pay`,
        {
          from_tag_id: fromTagId,
          to_tag_id: toTagId,
          quantity: quantity,
          user_id: api.user.id,
          token: api.user.token,
        },
        () => {
          api.updateWallet();
        }).fail((xhr) => {
          console.log('Fail' + xhr.status);
        });
    },
    updateRates: () => {
      $.get(`${api.serverURL}/rates`,
        {
          token: api.user.token,
        })
        .done((res) => {
          if (api.rates.length === 0) {
            api.ratesSelect = res.map(el => ({ text: el.alias, value: el }));
          }
          api.rates = res;
        })
      ;
    },
    updateChartRates: () => {
      $.get(`${api.serverURL}/rates/all`,
        {
          token: api.user.token,
        })
        .done((res) => {
          if (api.chartRates.labels.length === 0) {
            for (let i = 0; i < res.datasets.length; i += 1) {
              api.colors.push(randomColor({
                luminosity: 'light',
                alpha: 0.7, // e.g. 'rgba(9, 1, 107, 0.5)',
              }));
            }
          }
          res.datasets = res.datasets.map((set, i) => {
            set.borderColor = api.colors[i];
            set.backgroundColor = api.colors[i];
            set.pointBackgroundColor = api.colors[i];
            set.fill = false;
            return set;
          });
          res.labels = res.labels.map(label => label.substring(10, 19));
          api.chartRates = res;
        });
    },
    updateWallet: () => {
      $.get(`${api.serverURL}/wallet`,
        {
          token: api.user.token,
          user_id: api.user.id,
        })
        .done((res) => {
          api.wallet.push({});
          api.wallet = res;
        });
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
  mounted() {
    setInterval(this.$api.updateRates, 30000);
    setInterval(this.$api.updateChartRates, 30000);
  },
});
