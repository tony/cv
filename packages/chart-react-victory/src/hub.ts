import {
  activitiesQuery,
  activityTypesQuery,
  cvStore,
  query,
  orgsQuery,
  orgTypesQuery,
  languagesQuery,
} from "@tony/cv-lib/hub";
import { VictoryChartQuery } from "./query";

export const victoryChartQuery = new VictoryChartQuery(
  cvStore,
  query,
  activitiesQuery,
  activityTypesQuery,
  languagesQuery,
  orgsQuery,
  orgTypesQuery
);
