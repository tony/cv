/* eslint no-underscore-dangle: 0 */
import { mapActions } from 'vuex';
import { Line, mixins } from 'vue-chartjs';

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  mounted() {
    this.renderChart(
      this.chartData,
      {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Time',
          position: 'top',
          fontColor: '#4a4a4a',
          fontSize: '14',
          fontFamily: "'Avenir', Helvetica, Arial, sans-serif",
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              display: true,
            },
          }],
        },
        legend: {
          display: false,
        },
        onClick: (e, i) => {
          if (i && i.length) {
            const language = i[0]._model.label;
            this.$store.commit(
              'updateSelectedLanguages',
              [
                ...this.$store.state.selectedLanguages,
                ...this.$store.getters.availableLanguages.filter(lang => lang.name === language),
              ],
            );
          }
        },
      },
    );
  },
  methods: {
    ...mapActions([
      'updateSelectedLanguagesAction',
    ]),
  },
};
