<template>
  <div class="small">
    <line-chart :chart-data="datacollection"></line-chart>
    <button @click="test()">Randomize</button>
  </div>
</template>

<script>
  import LineChart from '../LineChart';

  export default {
    components: {
      LineChart,
    },
    data() {
      return {
        datacollection: null,
      };
    },
    mounted() {
      this.fillData();
    },
    methods: {
      fillData() {
        this.datacollection = {
          labels: [this.getRandomInt(), this.getRandomInt()],
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [1, 1],
            }, {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [2, 3],
            },
          ],
        };
      },
      test() {
        this.datacollection = {
          labels: [this.getRandomInt(), this.getRandomInt(), 11],
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [1, 1, 1],
            }, {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [2, 3, 5],
            },
          ],
        };
      },
      getRandomInt() {
        return Math.floor(Math.random() * (40)) + 5;
      },
    },
  };
</script>

