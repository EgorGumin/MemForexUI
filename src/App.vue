<template>
  <v-app id="app">
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Вход</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
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
      <v-container fluid fill-height>
        <v-layout
        >
          <hello></hello>
          {{$api.user}}
          <v-btn color="primary" @click="$api.login('admin', 'admin')">Войти</v-btn>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Hello from './components/Hello';

  export default {
    data: () => ({
      drawer: true,
    }),
    components: {
      Hello,
    },
    props: {
      source: String,
    },
  };

</script>
