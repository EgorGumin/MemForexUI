<template>
  <v-layout>
    {{$api.user}}
    <v-btn color="primary" @click="$api.login('admin', 'admin')">Войти</v-btn>
  </v-layout>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
    };
  },
};
</script>
