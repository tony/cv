import React from "react";

import { observer } from "mobx-react-lite";

import { ActivityCard } from "./Card";
import { useMst } from "./mobx";

export const ResultsHeader: React.FC = observer(() => {
  const { filteredActivities } = useMst();

  const resultsCount = filteredActivities ? filteredActivities.length : 0;

  return (
    <div id="results-info" className="py-0 lg:py-2">
      {resultsCount} results
    </div>
  );
});

export const ResultList = observer(() => {
  const { filteredActivities } = useMst();

  return (
    <ul
      id="results"
      className="divide-slate-700 divide-y md:divide-y-0 list-none"
    >
      {filteredActivities?.map?.((activity) => {
        return (
          <ActivityCard
            activity={activity}
            key={`activity-card-${activity?.id}`}
          />
        );
      })}
    </ul>
  );
});
export const Results = observer(() => {
  return (
    <div
      id="results-container"
      className="rounded-none md:rounded p-0 mx-auto my-0 lg:my-1 max-w-prose text-base"
    >
      <ResultsHeader />
      <ResultList />
      <div id="results-bottom" />
    </div>
  );
});
