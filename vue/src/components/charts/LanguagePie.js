import { Pie, mixins } from 'vue-chartjs';

export default {
  extends: Pie,
  props: ['activities'],
  mixins: [mixins.reactiveProp],
  mounted() {
    this.renderChart(
      this.chartData,
      {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
          labels: {
            fontColor: 'rgb(255, 99, 132)',
          },
        },
      },
    );
  },
};
