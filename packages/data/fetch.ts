import type { Activity, Category, Language, Org, OrgType } from "./types";

export interface IData {
  activities: Activity[];
  orgs: Org[];
  languages: Language[];
  orgTypes: OrgType[];
  categories: Category[];
}

export type fetchDataFn = () => Promise<IData>;
