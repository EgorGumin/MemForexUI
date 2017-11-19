<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex sm6>
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Покупка</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-card-text>
            <v-layout row>
              <v-flex xs6>
                <v-select
                  v-bind:items="$api.ratesSelect"
                  v-model="from"
                  label="Select"
                  single-line
                  bottom
                ></v-select>
              </v-flex>
              <v-flex xs6>
                <v-select
                  v-bind:items="$api.ratesSelect"
                  v-model="to"
                  label="Select"
                  single-line
                  bottom
                ></v-select>
              </v-flex>

            </v-layout>
            <v-text-field label="Обменять" v-model="sell"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn flat color="orange" @click="$api.pay(from.id, to.id, sell)">Купить</v-btn>
          </v-card-actions>
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
              <v-list-tile-content>
                <v-list-tile-title v-text="curr.alias"></v-list-tile-title>
                <v-list-tile-title v-text="curr.quantity"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>

      <v-flex sm6>
        <v-card>
          <line-chart :chart-data="$api.chartRates"></line-chart>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import LineChart from '../LineChart';

  export default {
    name: 'buy',
    components: {
      LineChart,
    },
    data() {
      return {
        sell: 0,
        to: {},
        from: {},
      };
    },
    methods: {
      updateData() {
      },
    },
    mounted() {
      this.$api.updateWallet();
    },
  };
</script>
