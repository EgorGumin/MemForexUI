<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex>
        <v-snackbar
          :color="transaction.messageCode === -1 ? 'success' : 'error'"
          v-model="transaction.showStatus"
        >
          {{transaction.messages[transaction.messageCode]}}
          <v-btn dark flat @click.native="transaction.showStatus = false">Закрыть</v-btn>
        </v-snackbar>
        <v-card>
          <v-toolbar>
            <v-icon>gavel</v-icon>
            <v-toolbar-title>Покупка</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-card-text sm6>
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
            <v-btn flat color="primary" @click="pay(from.id, to.id, sell)">Купить</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex sm6>
        <v-card>
          <v-toolbar>
            <v-icon>attach_money</v-icon>
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

      <v-flex xs12>
        <v-card>
          <v-toolbar>
            <v-icon>trending_up</v-icon>
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
  import $ from 'jquery';
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
        transaction: {
          showStatus: false,
          messageCode: -1,
          messages: {
            '-1': 'Все куплено',
            0: 'Покупка отменена',
          },
        },
      };
    },
    methods: {
      pay(fromTagId, toTagId, quantity) {
        const api = this.$api;
        $.post(`${api.serverURL}/pay`,
          {
            from_tag_id: fromTagId,
            to_tag_id: toTagId,
            quantity,
            user_id: api.user.id,
            token: api.user.token,
          })
          .done(() => {
            api.updateWallet();
            this.transaction.messageCode = -1;
            this.sell = 0;
          })
          .fail(() => {
            this.transaction.messageCode = 0;
          })
          .always(() => {
            this.transaction.showStatus = true;
          });
      },
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
