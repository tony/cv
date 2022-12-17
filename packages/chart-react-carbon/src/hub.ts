import {
  activitiesQuery,
  activityTypesQuery,
  cvStore,
  query,
  orgsQuery,
  orgTypesQuery,
  languagesQuery,
} from "@tony/cv-lib/hub";

import { CarbonChartQuery } from "./query";

export const carbonChartQuery = new CarbonChartQuery(
  cvStore,
  query,
  activitiesQuery,
  activityTypesQuery,
  languagesQuery,
  orgsQuery,
  orgTypesQuery
);
