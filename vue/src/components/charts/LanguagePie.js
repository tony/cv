/* eslint no-underscore-dangle: 0 import/no-extraneous-dependencies: 0 */
import { mapActions } from 'vuex';
import { Pie, mixins } from 'vue-chartjs';
import { pieOptions } from 'cv-lib/charts';

export default {
  extends: Pie,
  mixins: [mixins.reactiveProp],
  mounted() {
    this.renderChart(
      this.chartData,
      {
        ...pieOptions,
        onClick: (e, i) => {
          if (i && i.length) {
            const language = i[0]._model.label;
            if (!this.$store.state.selectedLanguages.find(lang => lang.name === language)) {
              this.$store.commit(
                'updateSelectedLanguages',
                [
                  ...this.$store.state.selectedLanguages,
                  ...this.$store.getters.availableLanguages.filter(lang => lang.name === language),
                ],
              );
            }
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
