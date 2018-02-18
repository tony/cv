<template>
  <div class="charts row padBottom">
    <div class="col-xs-12 col-sm-2 col-sm-offset-2">
      <language-pie
        :chart-data="languageData"
        style="width: 100%; height: 250px; position: relative;"
        />
    </div>
    <div class="col-xs-12 col-sm-6">
      <activity-line
        :chart-data="activityTimeData"
         style="width: 100%; height: 250px; position: relative;"
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
    ...mapGetters(['visibleActivities', 'countLanguagesFromVisibleActivities']),
    ...{
      languageData() {
        return getActivityLanguagePieData(this.countLanguagesFromVisibleActivities);
      },
      activityTimeData() {
        return getActivityTimeChartData(this.visibleActivities, Vue.moment);
      },
    },
  },
};
</script>
