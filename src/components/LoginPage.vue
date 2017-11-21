<template>

  <v-parallax
    src="https://i0.wp.com/westernslopewebdesignco.com/wp-content/uploads/2016/03/Blurred-Background-Sunset-3c-Free.jpg"
    height="100%"
    jumbotron
  >
    <v-layout align-center justify-center>
      <v-card>
        <v-flex class="pa-4">
          <v-form ref="form">
            <v-text-field
              label="Имя пользователя"
              v-model="login"
            ></v-text-field>
            <v-text-field
              type="password"
              label="Пароль"
              v-model="password"
            ></v-text-field>

            <v-btn
              block
              color = "primary"
              :loading="loginStatus.loading"
              @click="doLogin(login, password)"
            >
              Стать мемдером
            </v-btn>
          </v-form>
          <v-alert
            :value="loginStatus.showError"
            color="error"
            icon="warning"
            transition="scale-transition"
          >
            {{loginStatus.errorMessages[loginStatus.currentErrorMessageCode]}}
          </v-alert>
        </v-flex>
      </v-card>
    </v-layout>
  </v-parallax>

</template>
<script>
  import $ from 'jquery';

  export default {
    name: 'loginpage',
    data() {
      return {
        login: '',
        password: '',
        loginStatus: {
          showError: false,
          currentErrorMessageCode: -1,
          errorMessages: {
            '-1': 'Неизвестная ошибка',
            0: 'Проверьте интернет-соединение',
            401: 'Ошибка в логине или пароле',
          },
          loading: false,
        },
      };
    },
    methods: {
      doLogin(login, password) {
        const api = this.$api;
        this.loginStatus.showError = false;
        this.loginStatus.loading = true;
        $.post(`${api.serverURL}/login`,
          {
            login,
            password,
          })
          .done(
          (u) => {
            api.user = u;
            api.updateRates();
            api.updateChartRates();
            api.updateWallet();
          })
          .fail((error) => {
            this.loginStatus.showError = true;
            this.loginStatus.currentErrorMessageCode = error.status;
          })
          .always(() => {
            this.loginStatus.loading = false;
          });
      },
    },
  };
</script>
