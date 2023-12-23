import React from "react";

import { observer } from "mobx-react-lite";

import { ActivityCard } from "./Card";
import { useMst } from "./mobx";

export const ResultsHeader: React.FC = observer(() => {
  const { filteredActivities } = useMst();

  const resultsCount = filteredActivities ? filteredActivities.length : 0;

  return <div id="results-info">{resultsCount} results</div>;
});

export const ResultList = observer(() => {
  const { filteredActivities } = useMst();

  return (
    <div id="results">
      {filteredActivities?.map?.((activity, idx) => {
        return (
          <ActivityCard activity={activity} key={`activity-card-${idx}`} />
        );
      })}
    </div>
  );
});
export const Results = observer(() => {
  return (
    <div id="results-container">
      <ResultsHeader />
      <ResultList />
      <div id="results-bottom" />
    </div>
  );
});
