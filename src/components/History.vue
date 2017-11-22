<template>
  <v-layout>
    <v-data-table
      :items="history"
      v-bind:headers="headers"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td> <v-icon color="success" v-if="(props.item.predictedTo - props.item.quantityFrom > 0)">check_circle</v-icon></td>
        <td>{{ props.item.tagTo }}</td>
        <td>{{ props.item.tagFrom }}</td>
        <td>{{ props.item.quantityTo.toFixed(3) }}</td>
        <td>{{ props.item.quantityFrom.toFixed(3) }}</td>
        <td> {{ props.item.predictedTo.toFixed(3) }}</td>
        <td> {{ props.item.eventDate }}</td>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>
import $ from 'jquery';

export default {
  name: 'history',
  data() {
    return {
      history: [],
      headers: [
        { text: 'Успешная сделка', align: 'left', sortable: false },
        { text: 'Покупка', align: 'left' },
        {
          text: 'Продажа',
          align: 'left',
          value: 'tagFrom',
        },
        { text: 'Куплено', align: 'left', value: 'quantityTo' },
        { text: 'Продано', align: 'left', value: 'quantityFrom' },
        { text: 'Можно вернуть', align: 'left', value: 'predictedTo' },
        { text: 'Дата', align: 'left', value: 'eventDate' },
      ],
    };
  },
  methods: {
    updateHistory() {
      $.get(`${this.$api.serverURL}/pay/history`,
        {
          token: this.$api.user.token,
          user_id: this.$api.user.id,
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
