<template>

  <v-parallax
    src="https://i0.wp.com/westernslopewebdesignco.com/wp-content/uploads/2016/03/Blurred-Background-Sunset-3c-Free.jpg"
    height="100%"
    jumbotron
  >
    <v-layout align-center justify-center>
      <v-card>

        <v-flex class="pa-4">

          <v-form v-model="valid" ref="form">

            <v-text-field
              label="Имя пользователя"
              v-model="login"
            ></v-text-field>
            <v-text-field
              label="Пароль"
              v-model="password"
            ></v-text-field>

            <v-btn
              @click="$api.login(login, password)"
            >
              Стать мемдером
            </v-btn>

          </v-form>
        </v-flex>
      </v-card>
    </v-layout>
  </v-parallax>

  <!--<span class="wrapper" style="width: 100%; height: 100%">-->
  <!--<v-flex >-->

  <!--</v-flex>-->
  <!--</span>-->
  <!--<v-btn color="primary" @click="$api.login('admin', 'admin')">Войти</v-btn>-->

</template>

<script>
  export default {
    name: 'loginpage',
    data() {
      return {
        login: '',
        password: '',
      };
    },
  };
</script>
