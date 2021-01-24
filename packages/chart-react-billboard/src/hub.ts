import {
  activitiesQuery,
  activityTypesQuery,
  cvStore,
  query,
  orgsQuery,
  orgTypesQuery,
  languagesQuery,
} from "@tony/cv-lib/hub";
import { BillboardJSChartQuery } from "./query";

export const billboardJSChartQuery = new BillboardJSChartQuery(
  cvStore,
  query,
  activitiesQuery,
  activityTypesQuery,
  languagesQuery,
  orgsQuery,
  orgTypesQuery
);
