/* eslint no-underscore-dangle: 0 import/no-extraneous-dependencies: 0 */
import { mapActions } from 'vuex';
import { Line, mixins } from 'vue-chartjs';
import { timeLineOptions } from 'cv-lib/charts';

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  mounted() {
    this.renderChart(
      this.chartData,
      {
        ...timeLineOptions,
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
