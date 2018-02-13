export const getActivityTimeChartData = (activities, moment) => {
  /**
   * Return activity data structured for a line chart based on activities.
   *
   * @param activities {Array, <Object>}
   * @param moment <Object> moment.js object
   *
   * Notes on ESLint: https://github.com/airbnb/javascript/issues/719
   */
  let l = activities.reduce((acc1, activity) => {
    const acc = acc1;
    if (activity.created_date) {
      const year = moment(activity.created_date).get('year');
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
}


export const getActivityLanguagePieData = (activities) => {
  /**
   * Return activity data structured for a line chart based on activities.
   *
   * @param activities {Array, <Object>}
   */
  let l = activities.reduce((languages, activity) => {
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
}
