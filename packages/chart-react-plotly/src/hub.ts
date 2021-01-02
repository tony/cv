import {
  activitiesQuery,
  activityTypesQuery,
  cvStore,
  query,
  orgsQuery,
  orgTypesQuery,
  languagesQuery,
} from "@tony/cv-lib/hub";
import { PlotlyChartQuery } from "./query";

export const plotlyJSChartQuery = new PlotlyChartQuery(
  cvStore,
  query,
  activitiesQuery,
  activityTypesQuery,
  languagesQuery,
  orgsQuery,
  orgTypesQuery
);
