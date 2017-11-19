<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex sm6>
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Котировки</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list>
            <v-list-tile v-for="rate in $api.rates" v-bind:key="rate.id" @click="">
                <v-layout row justify-space-between>
                  <div>{{rate.alias}}</div>
                  <div>{{rate.rateRelative.toFixed(2)}}</div>
                </v-layout>
            </v-list-tile>

          </v-list>
        </v-card>
      </v-flex>
      <v-flex sm6>
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Мой кошелек</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list>
            <v-list-tile v-for="curr in $api.wallet" v-bind:key="curr.tagid" @click="">
              <v-layout row justify-space-between>
                <div>{{curr.alias}}</div>
                <div>{{curr.quantity.toFixed(3)}}</div>
              </v-layout>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>

      <v-flex sm12>
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Динамика изменения</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-flex>
            <div class="small">
              <line-chart :chart-data="$api.chartRates"></line-chart>
            </div>
          </v-flex>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import RandomChart from './RandomChart';
  import LineChart from '../LineChart';

  export default {
    name: 'hello',
    components: {
      RandomChart, LineChart,
    },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
      };
    },
    mounted() {
      this.$api.updateWallet();
    },
  };
</script>

<style>
  .small {
    width: 100%;
    max-height: 400px;
  }
</style>
