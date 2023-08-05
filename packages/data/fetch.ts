import type { Category, IActivity, IOrg, Language, OrgType } from "./types";

export interface IData {
  activities: IActivity[];
  orgs: IOrg[];
  languages: Language[];
  orgTypes: OrgType[];
  categories: Category[];
}

export type fetchDataFn = () => Promise<IData>;
