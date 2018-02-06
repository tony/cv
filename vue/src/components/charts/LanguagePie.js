import { Pie, mixins } from 'vue-chartjs';

export default {
  extends: Pie,
  props: ['activities'],
  mixins: [mixins.reactiveProp],
  mounted() {
    this.renderChart(this.chartData, { responsive: true, maintainAspectRatio: false });
  },
};
