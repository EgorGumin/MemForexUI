<template>
  <v-app id="app">
    <login-page v-if="!$api.user.token"></login-page>
    <div v-if="$api.user.token">
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
      dark
    ><v-toolbar color="transparent">
      <v-avatar
      >
        <img src="https://crowdfund.me.me/static/logo.png" alt="avatar">
      </v-avatar>
      <v-toolbar-title>MemForex</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
      <v-list dense>
        <v-list-tile @click="page = 'rates'">
          <v-list-tile-action>
            <v-icon>insert_chart</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Котировки</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="page = 'buy'">
          <v-list-tile-action>
            <v-icon>work</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Покупка</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="page = 'history'">
          <v-list-tile-action>
            <v-icon>lightbulb_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Анализ сделок</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title></v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-layout
        >
          <hello v-if="page==='rates'"></hello>
          <login v-if="page==='login'"></login>
          <buy v-if="page==='buy'"></buy>
          <history v-if="page==='history'"></history>
          <!--<random-chart></random-chart>-->
        </v-layout>
      </v-container>
    </v-content>
    </div>
  </v-app>
</template>

<script>
  import Hello from './components/Hello';
  import Login from './components/Login';
  import Buy from './components/Buy';
  import History from './components/History';
  import LoginPage from './components/LoginPage';

  export default {
    data: () => ({
      drawer: true,
      page: 'rates',
    }),
    components: {
      Hello, Login, Buy, History, LoginPage,
    },
    props: {
      source: String,
    },
  };

</script>
