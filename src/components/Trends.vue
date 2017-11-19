<template>
  <v-layout>
    <v-data-table
      :items="history"
      v-bind:headers="headers"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <!--<td> <v-icon color="success" v-if="(props.item.predictedTo - props.item.quantityFrom > 0)">check_circle</v-icon></td>-->
        <td>{{ props.item.rank }} <span style="padding-left: 15px;"><v-icon color="success" v-if="props.item.diff > 0">arrow_drop_up</v-icon><v-icon color="error" v-if="props.item.diff < 0">arrow_drop_down</v-icon>{{(props.item.diff < 0) ? (-1) * props.item.diff : (props.item.diff == 0) ? '' : props.item.diff}}</span></td>
        <td>{{ props.item.tagName }}</td>
        <td>{{ props.item.alias }}</td>
        <td>{{ props.item.trend.toFixed(3) }}</td>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>
import $ from 'jquery';

export default {
  name: 'trends',
  data() {
    return {
      history: [{ quantityto: 11 }],
      headers: [
        { text: 'Место', align: 'left', value: 'rank' },
        { text: 'Тренд', align: 'left', value: 'tagName' },
        {
          text: 'Валюта',
          align: 'left',
          value: 'alias',
        },
        { text: 'Изменение стоимости', align: 'left', value: 'trend' },
      ],
    };
  },
  methods: {
    updateHistory() {
      $.get(`${this.$api.serverURL}/rates/table`,
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
