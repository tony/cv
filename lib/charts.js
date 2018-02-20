export const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: true,
    text: 'Programming Languages',
    position: 'top',
    fontColor: '#4a4a4a',
    fontSize: '14',
    fontFamily: "'Avenir', Helvetica, Arial, sans-serif",
  },
  legend: {
    display: false,
  },
};

export const timeLineOptions = {
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
};

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
};


export const getActivityLanguagePieData = (languageCount) => {
  /**
   * Return activity data structured for a line chart based on activities.
   *
   * @param activities {Array, <Object>}
   */
  // flatten
  const l = Object.keys(languageCount).map(key => languageCount[key]);
  return {
    labels: l.map(lang => lang.name),
    datasets: [{
      backgroundColor: l.map(lang => lang.color),
      data: l.map(lang => lang.count),
    }],
  };
};
