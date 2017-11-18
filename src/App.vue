<template>
  <v-app id="app">
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-tile @click="page = 'login'">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Вход</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="page = 'rates'">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Котировки</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>MemForex</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-layout
        >
          <hello v-if="page==='rates'"></hello>
          <login v-if="page==='login'"></login>
          <!--<random-chart></random-chart>-->
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Hello from './components/Hello';
  import Login from './components/Login';
  import RandomChart from './components/RandomChart';

  export default {
    data: () => ({
      drawer: true,
      page: 'rates',
    }),
    components: {
      Hello, Login, RandomChart,
    },
    props: {
      source: String,
    },
  };

</script>
