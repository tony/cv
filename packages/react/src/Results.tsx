import React from "react";

import { observer } from "mobx-react-lite";
import { Virtuoso } from "react-virtuoso";

import { ActivityCard } from "./Card";
import { useMst } from "./mobx";

export const ResultsHeader: React.FC = observer(() => {
  const { filteredActivities } = useMst();

  const resultsCount = filteredActivities ? filteredActivities.length : 0;

  return <div id="results-info">{resultsCount} results</div>;
});

const FixedSizeListItem = observer(({ index }: { index: number }) => {
  const { filteredActivities } = useMst();
  return <ActivityCard activity={filteredActivities[index]} key={index} />;
});

export const ResultList = observer(() => {
  const { filteredActivitiesCount } = useMst();

  return (
    <Virtuoso
      style={{ height: "400px" }}
      totalCount={filteredActivitiesCount}
      itemContent={(index) => <FixedSizeListItem index={index} />}
    />
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
