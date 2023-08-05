import type { Activity, Category, IOrg, Language, OrgType } from "./types";

export interface IData {
  activities: Activity[];
  orgs: IOrg[];
  languages: Language[];
  orgTypes: OrgType[];
  categories: Category[];
}

export type fetchDataFn = () => Promise<IData>;
