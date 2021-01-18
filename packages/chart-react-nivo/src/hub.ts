import {
  activitiesQuery,
  activityTypesQuery,
  cvStore,
  query,
  orgsQuery,
  orgTypesQuery,
  languagesQuery,
} from "@tony/cv-lib/hub";
import { NivoChartQuery } from "./query";

export const nivoChartQuery = new NivoChartQuery(
  cvStore,
  query,
  activitiesQuery,
  activityTypesQuery,
  languagesQuery,
  orgsQuery,
  orgTypesQuery
);
