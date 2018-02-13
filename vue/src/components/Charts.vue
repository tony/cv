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
/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { getActivityLanguagePieData, getActivityTimeChartData } from 'cv-lib/charts';
import LanguagePie from './charts/LanguagePie';
import ActivityLine from './charts/ActivityLine';

export default {
  name: 'Charts',
  components: { LanguagePie, ActivityLine },
  computed: {
    ...mapGetters(['filteredActivitiesFinal']),
    ...{
      languages() {
        return getActivityLanguagePieData(this.filteredActivitiesFinal);
      },
      activityTimes() {
        return getActivityTimeChartData(this.filteredActivitiesFinal, Vue.moment);
      },
    },
  },
};
</script>
