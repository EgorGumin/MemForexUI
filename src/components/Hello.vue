<template>
  <v-container grid-list-md>
    <v-layout>

      <v-flex xs12 sm6>
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Котировки</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list>
            <v-list-tile v-for="rate in $api.rates" v-bind:key="rate.id" @click="">
              <v-list-tile-content>
                <v-list-tile-title v-text="rate.alias"></v-list-tile-title>
                <v-list-tile-title v-text="rate.rateRelative"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6>
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
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'hello',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
      };
    },
    mounted() {
      setInterval(this.$api.updateRates(), 1000);
      setInterval(this.$api.updateWallet(), 1000);
    },
  };
</script>
