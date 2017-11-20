<template>
  <v-layout>
    <v-data-table
      :items="history"
      v-bind:headers="headers"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <!--<td> <v-icon color="success" v-if="(props.item.predictedTo - props.item.quantityFrom > 0)">check_circle</v-icon></td>-->
        <td>{{ props.item.login }}</td>
        <td>{{ props.item.count.toFixed(3) }}</td>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>
import $ from 'jquery';

export default {
  name: 'leaders',
  data() {
    return {
      history: [{ quantityto: 11 }],
      headers: [
        { text: 'Мемолог', align: 'left', sortable: false },
        { text: 'Баланс в Bitcoin', align: 'left' },
      ],
    };
  },
  methods: {
    updateHistory() {
      $.get(`${this.$api.serverURL}/leaders`,
        {
          token: this.$api.user.token,
        })
        .done((res) => {
          this.history = res;
        });
    },
  },
  mounted() {
    this.updateHistory();
  },
};
</script>
