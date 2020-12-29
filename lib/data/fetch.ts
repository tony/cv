import type {
  ActivityType,
  Language,
  OrgType,
  IActivity,
  IOrg,
} from "../types";

export interface IData {
  activities: IActivity[];
  orgs: IOrg[];
  languages: Language[];
  orgTypes: OrgType[];
  activityTypes: ActivityType[];
}

export type fetchDataFn = Promise<IData>;
