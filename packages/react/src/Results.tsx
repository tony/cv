import React from "react";

import { orgsQuery } from "@tony/cv-lib/hub";
import type { Results as ReducerState } from "@tony/cv-lib/search/query";
import { ActivityCard } from "./Card";

import christmasTreeSvg from "@tony/cv-data/img/icons/christmas-tree.svg";

export const ResultsHeader: React.FC<{ results: ReducerState }> = ({
  results,
}) => {
  const resultsCount = results?.activities ? results.activities.length : 0;

  return (
    <div id="results-info">
      Found {resultsCount} results <img src={christmasTreeSvg} width="16" />
    </div>
  );
};

export const Results: React.FC<{ results: ReducerState }> = ({ results }) => {
  return (
    <div id="results">
      {results.activities &&
        results.activities.map((activity, idx) => {
          const org = orgsQuery.getEntity(activity.orgId);
          if (!org) return;
          return <ActivityCard activity={activity} org={org} key={idx} />;
        })}
    </div>
  );
};
