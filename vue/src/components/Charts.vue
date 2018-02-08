<template>
  <div class="charts row padBottom">
    <div class="col-sm-2 col-sm-offset-2">
      <language-pie
        :chart-data="languages"
        :height="250"
        />
    </div>
    <div class="col-sm-6 ">
      <activity-line
        :chart-data="activityTimes"
        :height="250"
        />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import LanguagePie from './charts/LanguagePie';
import ActivityLine from './charts/ActivityLine';

export default {
  name: 'Charts',
  components: { LanguagePie, ActivityLine },
  computed: {
    ...mapGetters(['filteredActivitiesFinal']),
    ...{
      languages() {
        // https://github.com/airbnb/javascript/issues/719
        let l = this.filteredActivitiesFinal.reduce((languages, activity) => {
          const rLanguages = languages;
          if (activity.actor.languages && activity.actor.languages.length) {
            activity.actor.languages.forEach((lang) => {
              if (lang.name in rLanguages) {
                rLanguages[lang.name].count += 1;
              } else {
                rLanguages[lang.name] = {
                  count: 1,
                  color: lang.color,
                  name: lang.name,
                };
              }
            });
          }
          return rLanguages;
        }, {});

        // flatten
        l = Object.keys(l).map(key => l[key]);
        return {
          labels: l.map(lang => lang.name),
          datasets: [{
            backgroundColor: l.map(lang => lang.color),
            data: l.map(lang => lang.count),
          }],
        };
      },
      activityTimes() {
        // https://github.com/airbnb/javascript/issues/719
        let l = this.filteredActivitiesFinal.reduce((acc1, activity) => {
          const acc = acc1;
          if (activity.created_date) {
            const year = Vue.moment(activity.created_date).get('year');
            if (year in acc) {
              acc[year].count += 1;
            } else {
              acc[year] = {
                count: 1,
                name: year,
              };
            }
          }
          return acc;
        }, {});

        // flatten
        l = Object.keys(l).map(key => l[key]);
        return {
          labels: l.map(lang => lang.name),
          datasets: [
            { data: l.map(lang => lang.count) },
          ],
        };
      },
    },
  },
};
</script>


<style>
.padBottom {
  margin-bottom: 1em;
}
</style>
