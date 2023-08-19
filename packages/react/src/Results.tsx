import React from "react";

import { observer } from "mobx-react-lite";

import { ActivityCard } from "./Card";
import { useMst } from "./mobx";

export const ResultsHeader: React.FC = observer(() => {
  const { filteredActivities } = useMst();

  const resultsCount = filteredActivities ? filteredActivities.length : 0;

  return <div id="results-info">{resultsCount} results</div>;
});

export const Results = observer(() => {
  const { filteredActivities } = useMst();

  return (
    <div id="results-container">
      <ResultsHeader />

      <div id="results">
        {filteredActivities &&
          filteredActivities.map((activity, idx) => {
            return (
              <ActivityCard activity={activity} org={activity.org} key={idx} />
            );
          })}
      </div>
      <div id="results-bottom"></div>
    </div>
  );
});
