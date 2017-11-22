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
    serverURL: 'localhost:8999',
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
  },
  methods: {
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
          // Generate random colors for labels once
          if (api.chartRates.labels.length === 0) {
            for (let i = 0; i < res.datasets.length; i += 1) {
              api.colors.push(randomColor({
                luminosity: 'light',
                alpha: 0.7,
              }));
            }
          }
          const MAX_POINTS = 100;
          const length = res.labels.length > MAX_POINTS ? MAX_POINTS : res.labels.length;
          const labels = [];

          for (let i = 0; i < length; i++) {
            labels.push(res.labels[i].substring(10, 19));
          }

          const datasets = res.datasets.map((set, i) => {
            set.borderColor = api.colors[i];
            set.backgroundColor = api.colors[i];
            set.pointBackgroundColor = api.colors[i];
            set.fill = false;
            if (set.data.length > MAX_POINTS) {
              set.data = set.data.slice(0, MAX_POINTS);
            }
            return set;
          });
          api.chartRates = { labels, datasets };
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
