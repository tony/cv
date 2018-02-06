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
        title: {
          display: true,
          text: 'Languages',
          position: 'top',
          fontColor: '#4a4a4a',
          fontSize: '14',
          fontFamily: "'Avenir', Helvetica, Arial, sans-serif",
        },
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
